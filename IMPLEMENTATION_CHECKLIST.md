# Dropshipping Integration - Implementation Checklist

## 🎯 Your Action Items

### Phase 1: Environment Setup (5 minutes)

- [ ] **Generate ENCRYPTION_SECRET**
  - Option A: `openssl rand -hex 16`
  - Option B: Use https://www.random.org/strings/
  - Example: `a7f2b9c1d4e6f8g1h3i5j7k9l2m4n6o8`

- [ ] **Add to Vercel**
  1. Go to: https://vercel.com/dashboard
  2. Select your project
  3. Settings → Environment Variables
  4. Click "Add New"
  5. Name: `ENCRYPTION_SECRET`
  6. Value: Your generated string
  7. Environments: Select all
  8. Save

- [ ] **Redeploy Project**
  1. Go to Deployments
  2. Find latest deployment
  3. Click three dots
  4. Select "Redeploy"
  5. Wait for completion (2-5 minutes)

- [ ] **Verify Setup**
  1. Visit `/admin/suppliers`
  2. You should see the supplier form
  3. No encryption errors in console
  4. ✓ Phase 1 complete!

---

### Phase 2: Add Your First Supplier (15 minutes)

#### If using Printful:
- [ ] Sign up at https://www.printful.com
- [ ] Go to: Settings → API → Generate API Key
- [ ] Copy the API key

#### If using Printfusion:
- [ ] Sign up at https://www.printfusion.com
- [ ] Go to: Account → API Settings
- [ ] Generate new API token
- [ ] Copy the token

#### If using Printnode:
- [ ] Sign up at https://www.printnode.com
- [ ] Go to: Account → API Credentials
- [ ] Generate new API key
- [ ] Note the API endpoint

#### Add Supplier to Dashboard:
- [ ] Go to `/admin/suppliers`
- [ ] Fill in the form:
  - **Supplier Name**: e.g., "Printful USA"
  - **Supplier Type**: Select from dropdown
  - **API Key**: Paste your API key
  - **API Endpoint**: Leave empty for defaults (or add if custom)
  - **Set as Primary**: Check this box

- [ ] Click "Test Connection"
  - Wait for result
  - Should show ✓ Success message

- [ ] Click "Add Supplier"
  - Supplier added to dashboard
  - Check "Configured Suppliers" list
  - ✓ Phase 2 complete!

---

### Phase 3: Test Order Creation (10 minutes)

- [ ] Visit `/store` page
- [ ] Add a product to cart
  - Wooden Keychain, Slate Coaster, or Photo Frame

- [ ] Go through checkout:
  - Enter customer info
  - Enter shipping address
  - Complete payment

- [ ] Order created ✓
  - You should see order confirmation
  - Email notification sent

- [ ] Check Order Sync Dashboard:
  1. Go to `/admin/order-sync`
  2. Find your test order
  3. Check status: should be "submitted" or "processing"
  4. Look for tracking number (may take 1-2 minutes)
  5. Check sync logs for success/errors

- [ ] Verify Supplier Received Order:
  1. Log into your supplier account
  2. Look in Orders section
  3. Find your test order
  4. Verify details match
  5. ✓ Phase 3 complete!

---

### Phase 4: Monitor & Verify (5 minutes)

- [ ] Check `/admin/order-sync`
  - Order status updated to "processing" or higher
  - Tracking number visible
  - No error messages

- [ ] Check supplier dashboard
  - Order shows as received
  - Production started (or queued)
  - No issues reported

- [ ] Review logs (if needed)
  - Go to `/admin/order-sync`
  - Click on order
  - Check "Sync Logs" section
  - Look for timestamps and actions

- [ ] ✓ System is working!

---

### Phase 5: Optional Enhancements

#### Customer Notifications
- [ ] Set up email templates for:
  - Order confirmation
  - Order shipped
  - Delivery update

- [ ] Configure email provider:
  - Sendgrid, Mailgun, or other

#### Webhook Integration
- [ ] Get webhook URL from supplier dashboard
- [ ] Configure webhook in supplier settings:
  ```
  https://yourdomain.com/api/webhooks/supplier/[supplier-id]
  ```

- [ ] Test webhook:
  - Supplier admin panel should have test button
  - Check database for webhook logs
  - Verify status updates in real-time

#### Product Mappings
- [ ] Map each product to best supplier:
  - Keychains → Printful or Printfusion
  - Coasters → Printfusion
  - Photo Frames → Printful

- [ ] Set priority levels:
  - Primary supplier (priority 10)
  - Secondary supplier (priority 5)

#### Multiple Suppliers
- [ ] Add 2-3 different suppliers
- [ ] Set one as primary
- [ ] Test order routing:
  - Primary supplier gets first order
  - Secondary gets if primary fails
  - Verify fallback works

---

## 🚀 Quick Reference

### Key URLs
| Page | URL | Use Case |
|------|-----|----------|
| Store | `/store` | Customer purchases |
| Admin Dashboard | `/admin` | Overview |
| Suppliers | `/admin/suppliers` | Add/manage suppliers |
| Order Tracking | `/admin/order-sync` | Monitor orders |

### Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "ENCRYPTION_SECRET not set" | Redeploy after adding env var |
| "Connection test failed" | Verify API key is correct |
| "Order not syncing" | Check supplier is active in dashboard |
| "No orders in sync dashboard" | Create a test order first |
| "Webhook not working" | Configure webhook URL in supplier settings |

### Support Resources
- Setup Guide: `DROPSHIPPING_SETUP.md`
- Quick Ref: `DROPSHIPPING_QUICK_REFERENCE.md`
- Environment: `ENVIRONMENT_SETUP.md`
- Build Details: `BUILD_SUMMARY.md`

---

## 📊 Progress Tracking

### Setup Progress
```
Phase 1: Environment        ⏳ [____________________]
Phase 2: First Supplier     ⏳ [____________________]
Phase 3: Test Order         ⏳ [____________________]
Phase 4: Verification       ⏳ [____________________]
Phase 5: Enhancements       ⏳ [____________________]

Status: Ready to start! 🚀
```

### Estimated Timeline
- Phase 1: 5 min
- Phase 2: 15 min
- Phase 3: 10 min
- Phase 4: 5 min
- **Total: ~35 minutes to go live**

---

## ✅ Success Criteria

Your integration is working when:

1. ✓ ENCRYPTION_SECRET set and redeployed
2. ✓ Supplier added via `/admin/suppliers`
3. ✓ "Test Connection" shows success
4. ✓ Test order created from `/store`
5. ✓ Order appears in `/admin/order-sync`
6. ✓ Status changes to "submitted"
7. ✓ Order visible in supplier account
8. ✓ No errors in database or logs

---

## 📝 Notes

Use this space to track your progress:

### Supplier 1
- Name: ________________
- Type: ________________
- Status: ________________

### Supplier 2
- Name: ________________
- Type: ________________
- Status: ________________

### Issues Encountered
1. ________________
2. ________________
3. ________________

### Questions
1. ________________
2. ________________
3. ________________

---

## 🎉 You're Ready!

Everything is built and ready to go. All you need to do is:

1. **Set ENCRYPTION_SECRET** (5 min)
2. **Add a supplier** (10 min)
3. **Create test order** (5 min)
4. **Verify it worked** (5 min)

**Total time to production: ~25 minutes**

---

**Good luck! 🚀 Let's make this work!**

Need help? Refer to the documentation files in your project.
