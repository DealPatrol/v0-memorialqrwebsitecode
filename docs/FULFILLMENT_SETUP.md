# Same-day keepsake fulfillment

Physical products stay hidden until the env vars below are set on the Vercel project **`v0-memorialqrwebsitecode-90`**. Saving the vars is not a code change. Vercel only gives a running deployment the new values after you redeploy that same commit. Do not deploy this branch until you intend to replace the digital-only site.

“Same day” means the supplier receives a **confirmed production order during checkout**. It does not mean the carrier delivers the same day. Printful and Printify still print and ship on their own schedule.

Prices below are the USD amounts in `lib/catalog.ts`. Checkout accepts **United States addresses only** (2-letter state and ZIP). Shipping is not added at checkout, so the margin is our price minus the supplier’s base price minus the shipping the supplier bills us.

## 1. Accounts

1. Create a **Printful** account and store. Add a billing method or wallet balance. Orders are sent with `confirm=1`, so a draft is treated as a failure.
2. Create a **Printify** account and one shop. Add a card. Each order is created and then `send_to_production` is called. If the card is missing, Printify leaves a draft and the site marks the order failed.
3. On both accounts, set the default ship-from so US addresses are allowed. The site always sends `country` / `country_code` as `US`.

You do **not** set `PRINTFUL_AUTO_CONFIRM`, `PRINTIFY_AUTO_PRODUCTION`, or `PRINTIFY_DEFAULT_VARIANT_ID`. Each product has its own id.

## 2. Create one blank product per keepsake

The printed file is a QR code generated at checkout. It encodes `https://memorialsqr.com/memorial/{order-slug}`. The family can add photos and stories later. The QR already opens that page.

For **Printful**, create a store product, then copy the numeric **sync variant id** (not the catalog variant id). The order replaces the product’s default artwork with that order’s QR URL.

For **Printify**, create a shop product from the blank below and publish it in the shop. Copy the **shop product id** and the numeric **variant id** of the size you want. At checkout the site reads that product’s blueprint, print provider, and placement, uploads this order’s QR, creates a new shop product so other orders are not overwritten, places the order, and sends it to production.

| Our product | Price | Supplier | Blank to create | Id to copy | Env var |
| --- | --- | --- | --- | --- | --- |
| Keep Card | $39.99 | Printful | Kiss-cut vinyl sticker, **3×3 in** | Sync variant id | `PRINTFUL_KEEP_CARD_TEMPLATE_ID` |
| Cork Memorial Coaster | $19.99 | Printful | Cork-back coaster (the single coaster size in the Printful catalog, about 3.74×3.74 in) | Sync variant id | `PRINTFUL_MEMORIAL_COASTER_TEMPLATE_ID` |
| Acrylic QR Keyring | $19.99 | Printify | Acrylic keychain / acrylic keyring. Pick one size and one print provider that ships to the US | Shop product id and variant id | `PRINTIFY_ACRYLIC_KEYRING_PRODUCT_ID`, `PRINTIFY_ACRYLIC_KEYRING_VARIANT_ID` |
| Voice Keychain | $24.99 | Printify | The **same acrylic keyring blank**. Make a second shop product so this item has its own ids. The voice recording is added on the memorial page after checkout; the print is the QR | Shop product id and variant id | `PRINTIFY_VOICE_KEYCHAIN_PRODUCT_ID`, `PRINTIFY_VOICE_KEYCHAIN_VARIANT_ID` |
| Slate Desk Plaque | $39.99 | Printify | Slate / rock-slate desk plaque, indoor. Pick one size | Shop product id and variant id | `PRINTIFY_SLATE_PLAQUE_PRODUCT_ID`, `PRINTIFY_SLATE_PLAQUE_VARIANT_ID` |
| Pet QR Tag | $24.99 | Printify | Pet tag / dog tag blank that ships to the US | Shop product id and variant id | `PRINTIFY_PET_TAG_PRODUCT_ID`, `PRINTIFY_PET_TAG_VARIANT_ID` |
| Memorial Photo Block | $59.99 | Printify | Acrylic photo block. Confirm a provider with a USD price before enabling it | Shop product id and variant id | `PRINTIFY_PHOTO_BLOCK_PRODUCT_ID`, `PRINTIFY_PHOTO_BLOCK_VARIANT_ID` |

Where to read the ids:

- Printful: store product → variants, or `GET https://api.printful.com/store/products/{id}` → `sync_variants[].id`. It must be a positive integer.
- Printify: the product id is the id in the shop product URL or `GET /v1/shops/{shop_id}/products/{id}.json`. The variant id is `variants[].id` for the size you enabled. The variant id must be a positive integer. The product id is the string Printify shows.

Shared keys (set once):

| Env var | Where it comes from |
| --- | --- |
| `PRINTFUL_API_TOKEN` | Printful → Settings → API |
| `PRINTIFY_API_TOKEN` | Printify → Connections → API |
| `PRINTIFY_SHOP_ID` | Printify shop id (the number in My Products / the API shop list) |

A product is shown on the home page and store, and accepted at checkout, only when **every** var in its row plus the shared keys for that supplier are non-empty. Template and variant ids that are not positive integers stay hidden. Digital concierge does not need these keys.

## 3. Env vars on Vercel

Project: **`v0-memorialqrwebsitecode-90`**.

Add these as Production (and Preview, if you want them on preview deploys). Leave them unset to keep that product hidden. Do not prefix them with `NEXT_PUBLIC_`.

```
PRINTFUL_API_TOKEN
PRINTFUL_KEEP_CARD_TEMPLATE_ID
PRINTFUL_MEMORIAL_COASTER_TEMPLATE_ID
PRINTIFY_API_TOKEN
PRINTIFY_SHOP_ID
PRINTIFY_ACRYLIC_KEYRING_PRODUCT_ID
PRINTIFY_ACRYLIC_KEYRING_VARIANT_ID
PRINTIFY_VOICE_KEYCHAIN_PRODUCT_ID
PRINTIFY_VOICE_KEYCHAIN_VARIANT_ID
PRINTIFY_SLATE_PLAQUE_PRODUCT_ID
PRINTIFY_SLATE_PLAQUE_VARIANT_ID
PRINTIFY_PET_TAG_PRODUCT_ID
PRINTIFY_PET_TAG_VARIANT_ID
PRINTIFY_PHOTO_BLOCK_PRODUCT_ID
PRINTIFY_PHOTO_BLOCK_VARIANT_ID
```

`RESEND_API_KEY` is already how the site sends mail. A failed dispatch emails `support@memorialsqr.com`. If Resend is missing, the failure is only written to the order and the server log.

After the vars are saved, redeploy the current production deployment so the functions can read them. No catalog code change is required. Home and store are rendered per request, so a later env change shows up on the next deployment without editing the product list.

## 4. Database columns

Run `scripts/025_add_pod_order_fulfillment_fields.sql` in the Supabase SQL editor. It adds `line_items`, `fulfillment_provider`, `fulfillment_id`, `fulfillment_status`, `fulfillment_data`, and `print_file_url` on `orders`.

Until that script is run, the site still places the supplier order and writes the result into `special_instructions` as `FULFILLMENT { ... }` plus `status` (`in_production` or `fulfillment_failed`).

## 5. What checkout does

1. Square captures payment first.
2. The server rejects the cart if any product is unknown or its env vars are missing.
3. The order row is saved.
4. For a physical cart, the server inserts a memorial whose slug is the order number (lowercased), for example `mqr-...`.
5. The QR image is `https://memorialsqr.com/api/print-file/{slug}`. Printful and Printify fetch that URL. It does not use blob storage. The public site must be reachable; a localhost URL cannot be printed.
6. The supplier order is placed and confirmed in that same request.
7. The order stores `success`, the supplier order id, or the error (`fulfillment_data`, or the fallback note above).
8. If dispatch fails, the customer still sees a successful checkout (they have already paid) and `support@memorialsqr.com` is emailed.

Optional tracking webhooks, after production orders already work:

- Printful: `https://memorialsqr.com/api/webhooks/printful` (package shipped)
- Printify: `https://memorialsqr.com/api/webhooks/printify` (shipment created)

## 6. Published base cost and margin

These are public catalog figures, not a quote from our accounts. Confirm the live price in Printful or Printify before you enable a product. Margin here is **our price − published base − published shipping**, and it ignores Square fees.

| Product | Our price | Published base | Published shipping | Margin after shipping | Source |
| --- | ---: | ---: | ---: | ---: | --- |
| Keep Card (3×3 kiss-cut) | $39.99 | about $1.95 | about $4.29 first item to the US | about $33.75 | Third-party Printful catalog summaries for the free plan, not an official Printful page. Confirm in the Printful dashboard. |
| Cork Memorial Coaster | $19.99 | $5.05 | extra, not in the $5.05 | less than $14.94 | Printful cork-back coaster product price. Shipping is billed by Printful on top. |
| Acrylic QR Keyring | $19.99 | about $2.08 to about $7 | about $7.29 from a China provider; US providers differ | often about $5 to $11 | PODL lists about $2.08 plus about $7.29 US shipping. US print providers are commonly about $4.50–$7 before shipping. |
| Voice Keychain | $24.99 | same acrylic blank as the keyring | same as the keyring | about $5 more than the keyring | Same blank, higher price. |
| Slate Desk Plaque | $39.99 | about $9.90–$13.20 | about $2 | about $24–$28 | Printbelle via PODL. Confirm the provider you actually enable. |
| Pet QR Tag | $24.99 | not published as one USD price | unknown | unknown until you pick a provider | Do not enable until Printify shows the USD cost and shipping. |
| Memorial Photo Block | $59.99 | from about €30.82 | from about €13.91 | can be thin in USD | Printify Acrylic Idea Factory list price in euros. Convert in the dashboard. If the USD total is near $59.99, leave the env vars unset. |

## 7. Dry run

From the repo:

```
pnpm test:fulfillment
```

That script mocks Printful and Printify. It checks that products stay hidden without env vars, that Printful is called with `confirm=1` and a US address, and that a Printify order is a failure when production is rejected.

## 8. Still manual

- Creating the Printful and Printify accounts, products, billing methods, and pasting the ids.
- Running the SQL script.
- Redeploying after the env vars are saved.
- Registering the optional shipment webhooks.
- Confirming pet-tag and photo-block USD cost before those products are turned on.
- Carrier transit time after the supplier accepts the order.
