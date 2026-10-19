-- 031: media kind (song | voicemail | video), visitor-upload moderation, and conversion metadata.
--
-- NOT applied to production by the PR that adds it. Apply it (Supabase SQL editor or
-- `apply_migration`) before or right after merging. The app works either way:
-- without these columns uploads are shown immediately, as before; with them,
-- visitor uploads wait as "pending" until the memorial owner approves them.
--
-- Idempotent: safe to run more than once.

begin;

-- ---------------------------------------------------------------------------
-- Moderation status + conversion metadata on every media table.
-- Existing rows become "approved" (they are already public); new rows default
-- to "pending" so any insert path that forgets the status is held for review.
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['photos', 'videos', 'music'] loop
    execute format('alter table public.%I add column if not exists status text not null default ''approved''', t);
    execute format('alter table public.%I alter column status set default ''pending''', t);
    execute format('alter table public.%I drop constraint if exists %I', t, t || '_status_check');
    execute format(
      'alter table public.%I add constraint %I check (status in (''pending'', ''approved'', ''rejected''))',
      t, t || '_status_check'
    );
    execute format('alter table public.%I add column if not exists original_url text', t);
    execute format('alter table public.%I add column if not exists content_type text', t);
    execute format('alter table public.%I add column if not exists size_bytes bigint', t);
    execute format(
      'create index if not exists %I on public.%I (memorial_id, status, created_at desc)',
      t || '_memorial_status_created_idx', t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- music: kind + the YouTube columns the /api/music/youtube route expected.
-- ---------------------------------------------------------------------------
alter table public.music add column if not exists kind text;
alter table public.music add column if not exists is_youtube boolean not null default false;
alter table public.music add column if not exists youtube_id text;
alter table public.music add column if not exists uploaded_by text;

-- Existing YouTube links saved in audio_url.
update public.music
set is_youtube = true,
    youtube_id = coalesce(
      youtube_id,
      substring(audio_url from '(?:v=|youtu\.be/|/embed/|/shorts/|/live/)([A-Za-z0-9_-]{11})')
    )
where audio_url ~* '(youtube\.com|youtu\.be|youtube-nocookie\.com)/'
  and (is_youtube = false or youtube_id is null);

-- Kind for existing rows: Android voicemail formats or "voicemail" in the title -> voicemail.
update public.music
set kind = case
  when is_youtube then 'song'
  when audio_url ~* '/voicemails/' then 'voicemail'
  when audio_url ~* '\.(amr|awb|3gp|3gpp|3g2)(\?|$)' then 'voicemail'
  when title ~* '(voice ?-?mail|voice memo|voice message)' then 'voicemail'
  else 'song'
end
where kind is null;

alter table public.music alter column kind set default 'song';
alter table public.music alter column kind set not null;
alter table public.music drop constraint if exists music_kind_check;
alter table public.music add constraint music_kind_check check (kind in ('song', 'voicemail', 'video'));
create index if not exists music_memorial_kind_idx on public.music (memorial_id, kind);

-- ---------------------------------------------------------------------------
-- Row-level security: the public only sees approved media; uploaders and the
-- memorial owner also see pending items.
-- Direct (anon-key) inserts are limited to the memorial owner with an https URL:
-- visitor uploads go through the site's API routes, which use the service role,
-- verify the Blob URL and set the status ("pending") themselves.
-- ---------------------------------------------------------------------------
drop policy if exists "photos_select_all" on public.photos;
drop policy if exists "photos_select_public" on public.photos;
drop policy if exists "photos_select_visible" on public.photos;
create policy "photos_select_visible" on public.photos for select using (
  status = 'approved'
  or auth.uid() = user_id
  or auth.uid() in (select m.user_id from public.memorials m where m.id = photos.memorial_id)
);

drop policy if exists "videos_select_public" on public.videos;
drop policy if exists "videos_select_visible" on public.videos;
create policy "videos_select_visible" on public.videos for select using (
  status = 'approved'
  or auth.uid() = user_id
  or auth.uid() in (select m.user_id from public.memorials m where m.id = videos.memorial_id)
);

drop policy if exists "Enable read access for all users" on public.music;
drop policy if exists "music_select_all" on public.music;
drop policy if exists "music_select_public" on public.music;
drop policy if exists "music_select_visible" on public.music;
create policy "music_select_visible" on public.music for select using (
  status = 'approved'
  or auth.uid() = user_id
  or auth.uid() in (select m.user_id from public.memorials m where m.id = music.memorial_id)
);

drop policy if exists "photos_insert_public" on public.photos;
drop policy if exists "photos_insert_authenticated" on public.photos;
drop policy if exists "photos_insert_moderated" on public.photos;
create policy "photos_insert_moderated" on public.photos for insert with check (
  (image_url like 'https://%' or (image_url like '/%' and image_url not like '//%'))
  and auth.uid() in (select m.user_id from public.memorials m where m.id = photos.memorial_id)
);

drop policy if exists "videos_insert_public" on public.videos;
drop policy if exists "videos_insert_moderated" on public.videos;
create policy "videos_insert_moderated" on public.videos for insert with check (
  (video_url like 'https://%' or (video_url like '/%' and video_url not like '//%'))
  and auth.uid() in (select m.user_id from public.memorials m where m.id = videos.memorial_id)
);

drop policy if exists "music_insert_public" on public.music;
drop policy if exists "music_insert_authenticated" on public.music;
drop policy if exists "music_insert_moderated" on public.music;
create policy "music_insert_moderated" on public.music for insert with check (
  (audio_url like 'https://%' or (audio_url like '/%' and audio_url not like '//%'))
  and auth.uid() in (select m.user_id from public.memorials m where m.id = music.memorial_id)
);

-- Durable log of visitor upload-token requests (service role only), used for daily caps.
create table if not exists public.media_upload_attempts (
  id bigint generated always as identity primary key,
  memorial_id uuid not null,
  ip text not null,
  created_at timestamptz not null default now()
);
create index if not exists media_upload_attempts_memorial_idx on public.media_upload_attempts (memorial_id, created_at desc);
create index if not exists media_upload_attempts_ip_idx on public.media_upload_attempts (ip, created_at desc);
alter table public.media_upload_attempts enable row level security;

-- Owners approve/hide items on their memorial.
drop policy if exists "photos_update_memorial_owner" on public.photos;
create policy "photos_update_memorial_owner" on public.photos for update using (
  auth.uid() in (select m.user_id from public.memorials m where m.id = photos.memorial_id)
);
drop policy if exists "videos_update_memorial_owner" on public.videos;
create policy "videos_update_memorial_owner" on public.videos for update using (
  auth.uid() in (select m.user_id from public.memorials m where m.id = videos.memorial_id)
);
drop policy if exists "music_update_memorial_owner" on public.music;
create policy "music_update_memorial_owner" on public.music for update using (
  auth.uid() in (select m.user_id from public.memorials m where m.id = music.memorial_id)
);

-- Ask PostgREST to pick up the new columns right away.
notify pgrst, 'reload schema';

commit;
