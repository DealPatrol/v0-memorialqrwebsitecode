-- Gift orders. Shipping still uses shipping_address_*.
-- When gift_ship_to_recipient is true, those columns are the recipient's address
-- and the package name is recipient_name. The buyer stays in customer_name.
-- Safe to run more than once.

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS is_gift BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS recipient_name TEXT,
ADD COLUMN IF NOT EXISTS gift_message TEXT,
ADD COLUMN IF NOT EXISTS gift_ship_to_recipient BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN orders.is_gift IS 'True when the buyer marked the order as a gift.';
COMMENT ON COLUMN orders.recipient_name IS 'Person the keepsake is for. Package name when gift_ship_to_recipient is true.';
COMMENT ON COLUMN orders.gift_message IS 'Short note from the buyer, shown to the person fulfilling the order. Not engraved.';
COMMENT ON COLUMN orders.gift_ship_to_recipient IS 'True when shipping_address_* is the recipient, not the buyer.';
