# POD fulfillment setup

Apply `scripts/026_add_pod_order_fulfillment_fields.sql` in Supabase before relying on the normalized fulfillment
fields. It is additive and does not delete or rewrite memorials or order content. Checkout and memorial linking fall
back to the legacy order columns if the migration or PostgREST schema refresh is not available yet.

Configure each product template ID on the server:

- `PRINTFUL_KEEP_CARD_TEMPLATE_ID`
- `PRINTFUL_MEMORIAL_COASTER_TEMPLATE_ID`
- `PRINTIFY_ACRYLIC_KEYRING_PRODUCT_ID`
- `PRINTIFY_VOICE_KEYCHAIN_PRODUCT_ID`
- `PRINTIFY_SLATE_PLAQUE_PRODUCT_ID`
- `PRINTIFY_PET_TAG_PRODUCT_ID`
- `PRINTIFY_PHOTO_BLOCK_PRODUCT_ID`

The Voice Keychain variable intentionally matches the existing Printify fulfillment work in PR #14. Template IDs
are captured per normalized line item; orders spanning Printful and Printify are marked with
`fulfillment_provider = 'mixed'`.
