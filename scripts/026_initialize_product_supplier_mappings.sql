-- Initialize product supplier mappings
-- This script should be run AFTER suppliers are configured
-- It sets up which products route to which suppliers

INSERT INTO public.product_supplier_mappings (
  supplier_id,
  product_type,
  product_name,
  supplier_product_id,
  supplier_product_name,
  priority,
  is_active
) VALUES
-- Wooden Keychain mappings
(
  (SELECT id FROM suppliers WHERE api_type = 'printful' AND is_active = true LIMIT 1),
  'wooden-keychain-necklace',
  'Memorial QR Code Wooden Keychain or Necklace',
  NULL,
  'Wooden Keychain with Custom Print',
  10,
  true
),
(
  (SELECT id FROM suppliers WHERE api_type = 'printfusion' AND is_active = true LIMIT 1),
  'wooden-keychain-necklace',
  'Memorial QR Code Wooden Keychain or Necklace',
  NULL,
  'Laser Engraved Wooden Keychain',
  5,
  true
),

-- Slate Coaster mappings
(
  (SELECT id FROM suppliers WHERE api_type = 'printfusion' AND is_active = true LIMIT 1),
  'slate-memorial-coaster',
  'Memorial Slate Coaster with QR Code',
  NULL,
  'Custom Engraved Slate Coaster',
  10,
  true
),
(
  (SELECT id FROM suppliers WHERE api_type = 'printnode' AND is_active = true LIMIT 1),
  'slate-memorial-coaster',
  'Memorial Slate Coaster with QR Code',
  NULL,
  'Slate Coaster Product',
  5,
  true
),

-- Photo Frame mappings
(
  (SELECT id FROM suppliers WHERE api_type = 'printful' AND is_active = true LIMIT 1),
  'memorial-photo-frame',
  'Memorial Photo Frame with QR Code',
  NULL,
  'Custom Photo Frame',
  10,
  true
),
(
  (SELECT id FROM suppliers WHERE api_type = 'printfusion' AND is_active = true LIMIT 1),
  'memorial-photo-frame',
  'Memorial Photo Frame with QR Code',
  NULL,
  'Engraved Photo Frame',
  5,
  true
)
ON CONFLICT (supplier_id, product_type) DO NOTHING;
