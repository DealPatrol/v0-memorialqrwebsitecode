-- Additive migration: preserves all existing memorials and content.
ALTER TABLE public.memorials
  ADD COLUMN IF NOT EXISTS product_type TEXT NOT NULL DEFAULT 'standard';

ALTER TABLE public.music
  ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'music',
  ADD COLUMN IF NOT EXISTS is_primary BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.videos
  ADD COLUMN IF NOT EXISTS embed_provider TEXT,
  ADD COLUMN IF NOT EXISTS embed_id TEXT;

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
