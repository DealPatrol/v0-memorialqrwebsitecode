# Dropshipping Integration Setup Guide

## Overview

Your Memorial QR website now has a complete dropshipping integration system that:
- Automatically routes orders to multiple suppliers (Printful, Printfusion, Printnode, or custom)
- Encrypts API keys for secure storage
- Tracks order status and shipping information
- Monitors sync logs and retry failed orders
- Provides admin dashboard for supplier management

## Prerequisites

Before setting up dropshipping suppliers, you need:

1. **ENCRYPTION_SECRET environment variable** - Used to encrypt supplier API keys
2. **Supplier API credentials** - API key from your chosen supplier(s)
3. **Admin account** - Access to `/admin/suppliers`

## Step 1: Set Up Encryption Secret

1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `ENCRYPTION_SECRET`
   - **Value**: Generate a strong 32-character random string (or use a password generator)
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

4. Deploy your project or redeploy to apply the environment variable

## Step 2: Get Supplier API Credentials

### Printful (Print-on-Demand)
1. Sign up at https://www.printful.com
2. Go to Settings → API
3. Generate an API key
4. Use this key in the supplier form

### Printfusion (Custom Engraving)
1. Sign up at https://www.printfusion.com
2. Navigate to Account → API Settings
3. Create a new API token
4. Copy the token for use in supplier setup

### Printnode (Volume Orders)
1. Create account at https://www.printnode.com
2. Go to Account → API Credentials
3. Generate API key
4. Note the API endpoint (usually `https://api.printnode.com`)

## Step 3: Add Your First Supplier

1. Log in to your admin dashboard
2. Go to **Suppliers** (in the admin menu)
3. Fill in the supplier form:
   - **Supplier Name**: e.g., "Printful USA"
   - **Supplier Type**: Select from dropdown
   - **API Key**: Paste your API credentials
   - **API Endpoint**: Leave blank for defaults (or provide custom endpoint)
   - **Set as Primary**: Check if this is your main supplier

4. Click **Test Connection** to verify credentials
5. If successful, click **Add Supplier**

## Step 4: Monitor Orders

Once suppliers are configured, orders will automatically sync:

1. **Automatic Sync**: When a customer completes checkout, their order is immediately sent to the configured supplier
2. **Monitoring**: Visit `/admin/order-sync` to see:
   - Order submission status
   - Supplier response and tracking numbers
   - Sync logs and error messages
   - Manual resync options for failed orders

## Security Features

### API Key Encryption
- All API keys are encrypted using AES-256-GCM
- Encryption key is the `ENCRYPTION_SECRET` environment variable
- Keys are never logged or exposed in error messages

### Order Routing
- Orders are routed based on product type
- Automatic retry logic for failed submissions (up to 3 retries)
- Fallback supplier option for each product

### Admin Access Control
- Supplier configuration requires admin authentication
- All API operations are server-side only
- Audit logs available in the Order Sync dashboard

## Supported Suppliers

| Supplier | Best For | Status |
|----------|----------|--------|
| Printful | Print-on-demand, general merchandise | ✓ Integrated |
| Printfusion | Custom engraving, laser etching | ✓ Integrated |
| Printnode | Volume orders, batch processing | ✓ Integrated |
| Custom | Any supplier with REST API | ✓ Framework ready |

## API Integration Details

### Order Sync Flow
```
1. Customer completes checkout
   ↓
2. Order created in database
   ↓
3. Supplier mapping checked (product → supplier)
   ↓
4. API key retrieved and decrypted
   ↓
5. Order sent to supplier via API
   ↓
6. Response logged and tracked
   ↓
7. Webhook listener awaits supplier updates
```

### Database Schema
- **suppliers**: Stores supplier config and encrypted API keys
- **order_suppliers**: Tracks which supplier each order was sent to
- **product_supplier_mappings**: Maps products to suppliers

## Troubleshooting

### "Connection test failed"
- Verify API key is correct
- Check API endpoint is valid
- Ensure supplier account is active and has API access

### "Order sync failed"
- Check Order Sync dashboard for error details
- Verify supplier account has required permissions
- Check product mapping is configured

### "ENCRYPTION_SECRET not found"
- Add the environment variable in Vercel settings
- Redeploy your project
- Environment variables are available after redeploy

## Advanced Configuration

### Multiple Suppliers
1. Add multiple suppliers via the admin panel
2. Set product-to-supplier mappings in the database
3. First active supplier with product mapping will receive orders
4. Failed orders automatically fallback to secondary suppliers

### Custom Webhook Handling
Suppliers can send webhooks back to your app:
```
POST /api/webhooks/supplier/{supplier-id}
```
This receives updates on:
- Order status changes
- Tracking number updates
- Shipping confirmations
- Error notifications

### Batch Processing
For volume orders, configure Printnode:
1. Set up scheduled batch submission
2. Orders queue in database with `submitted_at = NULL`
3. Batch job runs at specified time
4. All queued orders submitted together

## Next Steps

1. ✓ Set ENCRYPTION_SECRET environment variable
2. ✓ Add your first supplier
3. ✓ Test order creation and submission
4. ✓ Monitor via Order Sync dashboard
5. ✓ Configure product-supplier mappings (optional)
6. ✓ Set up webhook handlers (optional)

## Support

For issues or questions:
- Check the Order Sync dashboard for detailed logs
- Review environment variables in Vercel settings
- Verify supplier API credentials and account status
- Check database tables for order sync records

---

**Last updated**: 2026-03-28  
**Status**: Production Ready
