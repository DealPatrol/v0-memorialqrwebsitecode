-- Migration: record included hosting term for physical keepsake orders.
-- Strictly additive and safe for existing data.
-- Physical keepsake orders: hosting_included_until = order date + 10 years; no monthly subscription.
-- Digital-only orders: hosting_included_until stays NULL and the $4.99/month subscription applies.

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS hosting_included_until TIMESTAMPTZ;

ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS hosting_included_until TIMESTAMPTZ;

COMMENT ON COLUMN orders.hosting_included_until IS 'End of included basic hosting (order date + 10 years for physical keepsake orders); NULL for digital-only monthly hosting';
COMMENT ON COLUMN memorials.hosting_included_until IS 'End of included basic hosting copied from the linked physical keepsake order; NULL for digital-only monthly hosting';
