# Print-on-Demand (POD) Fulfillment Documentation

This document describes the automated Print-on-Demand (POD) fulfillment pipeline for MemorialsQR.

## Overview

The store operates exclusively on a dropship Print-on-Demand model. No physical inventory is stocked or engraved manually. Every order generates a unique memorial destination URL, high-resolution (300 DPI) composite print file with QR code and memorial details, and automatically dispatches to Printful or Printify.

## Product Catalog & Fulfillment Mapping

| SKU | Product Name | Provider | Fulfillment Type | Environment Template Variable |
|---|---|---|---|---|
| `keep-card` | Keep Card (Sticker + Profile) | Printful | Kiss-cut vinyl sticker | `PRINTFUL_KEEP_CARD_TEMPLATE_ID` |
| `memorial-coaster` | Cork Memorial Coaster | Printful | Cork-back coaster | `PRINTFUL_MEMORIAL_COASTER_TEMPLATE_ID` |
| `acrylic-keyring` | Acrylic QR Keyring | Printify | Acrylic keyring | `PRINTIFY_ACRYLIC_KEYRING_PRODUCT_ID` |
| `voice-keychain` | Voice Keychain | Printify | Acrylic keyring | `PRINTIFY_VOICE_KEYCHAIN_PRODUCT_ID` |
| `slate-plaque` | Slate Desk Plaque | Printify | Slate desk plaque (indoor) | `PRINTIFY_SLATE_PLAQUE_PRODUCT_ID` |
| `pet-tag` | Pet QR Tag | Printify | Pet/dog tag | `PRINTIFY_PET_TAG_PRODUCT_ID` |
| `photo-block` | Memorial Photo Block | Printify | Acrylic/wood photo block | `PRINTIFY_PHOTO_BLOCK_PRODUCT_ID` |

## Required Environment Variables

### Printful
- `PRINTFUL_API_TOKEN`: Private API token from your Printful dashboard (requires `orders` and `store` scopes).
- `PRINTFUL_AUTO_CONFIRM`: Optional (`"true"` to submit orders directly to fulfillment, `"false"` to create draft orders for manual review).

### Printify
- `PRINTIFY_API_TOKEN`: Personal Access Token from your Printify account settings.
- `PRINTIFY_SHOP_ID`: The numeric shop ID for your MemorialsQR Printify store.
- `PRINTIFY_DEFAULT_VARIANT_ID`: Optional default variant ID for keychain/plaque prints.
- `PRINTIFY_AUTO_PRODUCTION`: Optional (`"true"` to send to production immediately, `"false"` to keep in review).

## Database Migration

Run `scripts/025_add_pod_order_fulfillment_fields.sql` in Supabase SQL Editor.
The migration is additive and adds:
- `orders.line_items` (JSONB)
- `orders.fulfillment_provider` (TEXT)
- `orders.fulfillment_id` (TEXT)
- `orders.fulfillment_status` (TEXT)
- `orders.fulfillment_data` (JSONB)
- `orders.print_file_url` (TEXT)

The code includes graceful fallbacks that continue functioning even if the database has not yet been migrated.

## End-to-End Workflow

1. **Purchase**: Customer selects one or more POD items on `/store` and completes Square checkout at `/checkout/simple`.
2. **Order Creation**: `/api/checkout/process` validates line items against canonical catalog prices, verifies the Square payment, and saves the order with status `awaiting_memorial_setup`.
3. **Account Creation**: Customer is directed to `/auth/create-account?orderId=...`, which links their new user account to the paid order.
4. **Guided Memorial Setup**: Customer completes the 6-step wizard at `/create-memorial?orderId=...`, providing photos, biography, family tree, and voice recordings.
5. **Print Asset Generation & Linking**: `/api/memorials` creates the memorial, generates the unique slug URL, renders a 300 DPI composite print file (`lib/print-asset-generator.ts`), and attaches `print_file_url` to the order.
6. **Automated Order Dispatch**: `dispatchOrderFulfillment` (`lib/fulfillment-dispatcher.ts`) automatically submits line items to Printful and/or Printify with the recipient's shipping address and print file URL.
7. **Tracking Webhooks**:
   - Printful webhook: `POST /api/webhooks/printful` (handles `package_shipped`)
   - Printify webhook: `POST /api/webhooks/printify` (handles `order:shipment:created`)
   - Order status automatically updates to `shipped` with tracking number and tracking carrier saved in the database.
