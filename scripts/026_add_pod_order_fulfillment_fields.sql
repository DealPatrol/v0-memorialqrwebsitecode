-- Add normalized POD fulfillment data without changing or deleting existing orders.
-- The application retains the legacy product fields and can operate before this
-- migration is applied or while PostgREST refreshes its schema cache.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS fulfillment_provider TEXT,
  ADD COLUMN IF NOT EXISTS fulfillment_id TEXT,
  ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS fulfillment_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS print_file_url TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status
  ON public.orders(fulfillment_status);

COMMENT ON COLUMN public.orders.line_items IS
  'Normalized POD line items with SKU, quantity, pricing, provider, product, and configured template ID.';
COMMENT ON COLUMN public.orders.fulfillment_provider IS
  'POD provider for the order, or mixed when line items span providers.';
COMMENT ON COLUMN public.orders.fulfillment_id IS
  'Provider order identifier after the order is submitted for production.';
COMMENT ON COLUMN public.orders.fulfillment_status IS
  'POD lifecycle state, independent of customer-facing order status.';
COMMENT ON COLUMN public.orders.fulfillment_data IS
  'Provider-neutral fulfillment metadata such as tracking or error details.';
COMMENT ON COLUMN public.orders.print_file_url IS
  'Personalized memorial artwork URL used for POD production.';
