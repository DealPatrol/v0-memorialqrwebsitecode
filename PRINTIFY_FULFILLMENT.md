# Printify Voice Keychain fulfillment

The Voice Keychain uses Printify catalog blueprint **674**, the acrylic Keyring Tag. Create one product from that
blueprint in the MemorialsQR Printify shop and use it as the template. The checkout integration reads the template's
provider, variants, and print areas so provider-specific IDs are not hard-coded.

Configure these server-side variables:

- `PRINTIFY_API_TOKEN`
- `PRINTIFY_SHOP_ID`
- `PRINTIFY_VOICE_KEYCHAIN_PRODUCT_ID` — the product ID of the blueprint 674 template
- `PRINTIFY_VOICE_KEYCHAIN_VARIANT_ID` — optional; defaults to the template's first enabled variant
- `PRINTIFY_SHIPPING_METHOD` — optional; defaults to standard shipping (`1`)

After Square payment, the server uploads the memorial's unique QR image, creates a personalized product from the
configured template, creates the Printify order, and sends it to production. The resulting order ID and status are
stored on the MemorialsQR order. If Printify is not configured, checkout still reserves the memorial and records
`awaiting_configuration` so fulfillment can be completed after configuration without losing the buyer's QR setup.
