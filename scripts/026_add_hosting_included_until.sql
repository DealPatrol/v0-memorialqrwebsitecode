-- Migration 026: record the included hosting term for physical keepsake orders.
-- NOT APPLIED. Review, then run in the Supabase SQL editor for the production project.
-- Strictly additive: two nullable columns, no defaults, no backfill, no data rewritten.
-- Physical keepsake orders: hosting_included_until = order date + 10 years; no monthly subscription.
-- Digital-only orders: hosting_included_until stays NULL and the $4.99/month subscription applies.
-- Until this runs, checkout keeps working: the date is saved in orders.admin_notes instead
-- (and in fulfillment_data when migration 025 is applied).

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS hosting_included_until TIMESTAMPTZ;

ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS hosting_included_until TIMESTAMPTZ;

COMMENT ON COLUMN orders.hosting_included_until IS 'End of included basic hosting (order date + 10 years for physical keepsake orders); NULL for digital-only monthly hosting';
COMMENT ON COLUMN memorials.hosting_included_until IS 'End of included basic hosting copied from the linked physical keepsake order; NULL for digital-only monthly hosting';

-- Rollback (only if needed):
-- ALTER TABLE orders DROP COLUMN IF EXISTS hosting_included_until;
-- ALTER TABLE memorials DROP COLUMN IF EXISTS hosting_included_until;
