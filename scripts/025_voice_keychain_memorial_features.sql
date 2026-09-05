-- Additive migration: preserves all existing memorials and content.
ALTER TABLE public.memorials
  ADD COLUMN IF NOT EXISTS product_type TEXT NOT NULL DEFAULT 'standard';

ALTER TABLE public.music
  ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'music',
  ADD COLUMN IF NOT EXISTS is_primary BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_youtube BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS youtube_id TEXT,
  ADD COLUMN IF NOT EXISTS uploader_name TEXT;

ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS embed_provider TEXT,
  ADD COLUMN IF NOT EXISTS embed_id TEXT;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS fulfillment_provider TEXT,
  ADD COLUMN IF NOT EXISTS fulfillment_id TEXT,
  ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'pending';

CREATE TABLE IF NOT EXISTS public.external_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_external_links_memorial_id ON public.external_links(memorial_id);
CREATE INDEX IF NOT EXISTS idx_family_members_memorial_id ON public.family_members(memorial_id);
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Setup and account claiming use verified server-side order access. Do not let an
-- arbitrary authenticated user claim any memorial that happens to be unowned.
DROP POLICY IF EXISTS "memorials_update_claim" ON public.memorials;
DROP POLICY IF EXISTS "memorials_update_flexible" ON public.memorials;
DROP POLICY IF EXISTS "memorials_update_own" ON public.memorials;
CREATE POLICY "memorials_update_own"
  ON public.memorials FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "external_links_select_public"
  ON public.external_links FOR SELECT USING (true);
CREATE POLICY "external_links_manage_owner"
  ON public.external_links FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = external_links.memorial_id
      AND memorials.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = external_links.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

CREATE POLICY "family_members_select_public"
  ON public.family_members FOR SELECT USING (true);
CREATE POLICY "family_members_manage_owner"
  ON public.family_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = family_members.memorial_id
      AND memorials.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memorials
      WHERE memorials.id = family_members.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

-- Enrich the existing featured memorial without replacing or deleting any of
-- Glenda's current biography, photos, music, messages, or ownership data.
INSERT INTO public.family_members (memorial_id, name, relationship)
SELECT memorials.id, seed.name, seed.relationship
FROM public.memorials
CROSS JOIN (
  VALUES
    ('Lynn Kelso', 'Husband'),
    ('Eddie Kelso', 'Son'),
    ('Penny Collins', 'Daughter'),
    ('Cole Collins', 'Grandson')
) AS seed(name, relationship)
WHERE memorials.slug = 'glenda-kelso'
  AND NOT EXISTS (
    SELECT 1
    FROM public.family_members
    WHERE family_members.memorial_id = memorials.id
      AND family_members.name = seed.name
      AND family_members.relationship = seed.relationship
  );

INSERT INTO public.external_links (memorial_id, label, url)
SELECT memorials.id, 'The story behind Memorial QR', 'https://www.memorialsqr.com/our-story'
FROM public.memorials
WHERE memorials.slug = 'glenda-kelso'
  AND NOT EXISTS (
    SELECT 1
    FROM public.external_links
    WHERE external_links.memorial_id = memorials.id
      AND external_links.url = 'https://www.memorialsqr.com/our-story'
  );
