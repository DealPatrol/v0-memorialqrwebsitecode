-- Migration 026: record the included hosting term for physical keepsake orders.
-- NOT APPLIED. Review, then run in the Supabase SQL editor for the production project.
-- Strictly additive: two nullable columns, no defaults, no backfill, no data rewritten.
-- Every paid order (keepsake or concierge): hosting_included_until = order date + 10 years.
-- There is no monthly plan. Older orders keep NULL.
-- Until this runs, checkout keeps working: the date is saved in orders.admin_notes instead
-- (and in fulfillment_data when migration 025 is applied).

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS hosting_included_until TIMESTAMPTZ;

ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS hosting_included_until TIMESTAMPTZ;

COMMENT ON COLUMN orders.hosting_included_until IS 'End of included hosting (order date + 10 years); NULL for orders placed before this column existed';
COMMENT ON COLUMN memorials.hosting_included_until IS 'End of included hosting copied from the linked keepsake order; NULL when not set';

-- Rollback (only if needed):
-- ALTER TABLE orders DROP COLUMN IF EXISTS hosting_included_until;
-- ALTER TABLE memorials DROP COLUMN IF EXISTS hosting_included_until;
