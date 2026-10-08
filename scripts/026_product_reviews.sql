-- Reviews from buyers, and the one-time links sent after an order is fulfilled.
-- Run in the Supabase SQL editor. Service role writes. Visitors can read published reviews.

CREATE TABLE IF NOT EXISTS public.review_invites (
  token UUID PRIMARY KEY,
  order_id UUID,
  order_number TEXT NOT NULL,
  product_id TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  product_id TEXT NOT NULL,
  order_number TEXT UNIQUE,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden'))
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON public.product_reviews(product_id, status);

ALTER TABLE public.review_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published reviews"
  ON public.product_reviews
  FOR SELECT
  USING (status = 'published');
