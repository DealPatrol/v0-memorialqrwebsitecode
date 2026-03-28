# Dropshipping Integration - Environment Setup

## Required Environment Variables

Add these to your Vercel project settings (Settings → Environment Variables):

### 1. ENCRYPTION_SECRET (Required)
**Purpose**: Encrypts supplier API keys before storing in database

**How to generate**:
Option A - Use OpenSSL:
```bash
openssl rand -hex 16
```

Option B - Use Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Option C - Use online generator:
https://www.random.org/strings/?num=1&len=32&digits=on&loweralpha=on&format=html&rnd=new

**Example value**:
```
a7f2b9c1d4e6f8g1h3i5j7k9l2m4n6o8
```

**Usage**:
- Set this once in Vercel settings
- Never commit to version control
- Used automatically by `/lib/suppliers/encryption.ts`

---

## Already Configured

These environment variables are already set up from your Supabase integration:

✓ `NEXT_PUBLIC_SUPABASE_URL`  
✓ `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
✓ `SUPABASE_SERVICE_ROLE_KEY`  

---

## Optional Environment Variables

### Custom Supplier Endpoints
If using custom suppliers, you can override API endpoints:

```
CUSTOM_SUPPLIER_ENDPOINT=https://api.yoursupplier.com
```

### Webhook Signing
For webhook security (optional):

```
WEBHOOK_SECRET=your-webhook-signing-key
```

---

## Vercel Environment Variables Setup

### Step 1: Go to Project Settings
1. https://vercel.com/dashboard
2. Select your project
3. Click **Settings**
4. Select **Environment Variables**

### Step 2: Add ENCRYPTION_SECRET
1. Click **Add New**
2. Fill in:
   - **Name**: `ENCRYPTION_SECRET`
   - **Value**: Your generated 32-char string
   - **Environments**: Select all (Production, Preview, Development)
3. Click **Save**

### Step 3: Redeploy
1. Go to **Deployments**
2. Click the three dots on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 4: Verify
Test by:
1. Go to `/admin/suppliers`
2. Add a supplier
3. Click "Test Connection"
4. If it works, environment variable is set correctly

---

## Local Development Setup

### Create `.env.local`
If developing locally, create a `.env.local` file:

```bash
# .env.local

# Supabase (copy from Vercel)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Encryption (generate unique key for dev)
ENCRYPTION_SECRET=your_dev_encryption_secret_here

# Optional: Local API endpoints
CUSTOM_SUPPLIER_ENDPOINT=http://localhost:3001
WEBHOOK_SECRET=dev-webhook-secret
```

### Generate Dev Encryption Secret
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### Never Commit Secrets
Add to `.gitignore`:
```
.env.local
.env.*.local
```

---

## Security Best Practices

### ✓ Do This
- Store ENCRYPTION_SECRET in Vercel settings only
- Use unique ENCRYPTION_SECRET for dev vs production
- Rotate ENCRYPTION_SECRET periodically
- Never commit .env.local to Git
- Use strong random strings (32+ characters)
- Review environment variables regularly

### ✗ Don't Do This
- Don't hardcode ENCRYPTION_SECRET in code
- Don't share ENCRYPTION_SECRET in messages/emails
- Don't use same secret for multiple environments
- Don't commit .env files to Git
- Don't use simple/predictable secrets
- Don't log ENCRYPTION_SECRET in console

---

## Testing the Setup

### Verify ENCRYPTION_SECRET is Available
```typescript
// This should not throw an error
const secret = process.env.ENCRYPTION_SECRET
if (!secret) throw new Error('ENCRYPTION_SECRET not set')
```

### Test Encryption (in Server Component)
```typescript
import { encryptString, decryptString } from '@/lib/suppliers/encryption'

const testKey = 'my-api-key-123'
const encrypted = encryptString(testKey)
const decrypted = decryptString(encrypted)
console.log(testKey === decrypted) // Should be true
```

---

## Troubleshooting Environment Variables

### Issue: "ENCRYPTION_SECRET not found"
**Solution**:
1. Verify environment variable is set in Vercel
2. Redeploy the project
3. Check Vercel deployment logs
4. Wait 1-2 minutes after setting variable

### Issue: "Decryption failed"
**Possible Causes**:
- ENCRYPTION_SECRET changed after initial encryption
- API key was encrypted with different secret
- Corrupted encrypted value

**Solution**:
- Don't change ENCRYPTION_SECRET for existing encrypted keys
- Delete supplier and re-add with current secret
- Check database for corrupted values

### Issue: "Environment variable undefined in client"
**Expected Behavior**:
- Only server-side env vars work
- Client-side must have `NEXT_PUBLIC_` prefix
- Sensitive keys (secrets) must be server-only

**Solution**:
- Don't access ENCRYPTION_SECRET in browser
- Use server actions or API routes for encryption
- Move logic to server component if needed

---

## Deployment Checklist

Before deploying to production:

- [ ] ENCRYPTION_SECRET generated and set in Vercel
- [ ] `.env.local` NOT committed to Git
- [ ] Supplier API keys NOT hardcoded anywhere
- [ ] All environment variables visible in Vercel settings
- [ ] Project successfully redeployed
- [ ] `/admin/suppliers` page accessible
- [ ] Supplier connection test works

---

## Reference

### Environment Variable Scopes

| Variable | Scope | Required | Location |
|----------|-------|----------|----------|
| ENCRYPTION_SECRET | Server-side | Yes | Vercel Settings |
| NEXT_PUBLIC_SUPABASE_URL | Public | Yes | Vercel Settings |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Public | Yes | Vercel Settings |
| SUPABASE_SERVICE_ROLE_KEY | Server-side | Yes | Vercel Settings |

### File Locations

```
Project Root
├── .env.local (dev only, not committed)
├── .env.example (template for team)
├── app/
│   ├── api/suppliers/
│   └── admin/suppliers/
├── lib/
│   └── suppliers/
│       └── encryption.ts ← Uses ENCRYPTION_SECRET
└── scripts/
    └── 025_create_suppliers_tables.sql
```

---

**Last Updated**: 2026-03-28  
**Version**: 1.0.0
