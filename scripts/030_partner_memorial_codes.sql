-- Short codes for printed QR memorials. Additive only.
-- Run in the Supabase SQL editor before taking orders that create memorials.
ALTER TABLE public.memorials ADD COLUMN IF NOT EXISTS partner_managed BOOLEAN NOT NULL DEFAULT FALSE;

DROP POLICY IF EXISTS "memorials_update_claim" ON public.memorials;
DROP POLICY IF EXISTS "memorials_update_flexible" ON public.memorials;
DROP POLICY IF EXISTS "memorials_update_own" ON public.memorials;

CREATE POLICY "memorials_update_flexible" ON public.memorials
  FOR UPDATE
  USING (
    (auth.uid() = user_id)
    OR (
      user_id IS NULL
      AND auth.uid() IS NOT NULL
      AND COALESCE(partner_managed, false) = FALSE
    )
  )
  WITH CHECK (
    (auth.uid() = user_id)
    OR (
      user_id IS NULL
      AND auth.uid() IS NOT NULL
      AND COALESCE(partner_managed, false) = FALSE
    )
  );

CREATE TABLE IF NOT EXISTS public.partner_memorial_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  external_order_id TEXT NOT NULL,
  line_item_id TEXT NOT NULL DEFAULT '',
  memorial_id UUID NOT NULL REFERENCES public.memorials(id) ON DELETE CASCADE,
  buyer_email TEXT NOT NULL,
  claimed_at TIMESTAMPTZ,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source, external_order_id, line_item_id)
);

ALTER TABLE public.partner_memorial_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "partner_codes_select_own" ON public.partner_memorial_codes;
CREATE POLICY "partner_codes_select_own" ON public.partner_memorial_codes
  FOR SELECT
  USING (auth.uid() = owner_user_id);
