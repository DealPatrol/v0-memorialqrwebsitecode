# Email Notification Setup Guide

This application uses Resend for sending email notifications. Follow these steps to set up email functionality.

## Prerequisites

1. Sign up for a free Resend account at [resend.com](https://resend.com)
2. Verify your domain (or use Resend's test domain for development)

## Environment Variables

Add the following environment variables to your Vercel project:

### Required:
- `RESEND_API_KEY` - Your Resend API key (get from Resend dashboard)

### Optional:
- `ADMIN_EMAIL` - Email address to receive new order notifications (defaults to admin@memorialqr.com)

## Getting Your Resend API Key

1. Log in to your Resend dashboard
2. Navigate to API Keys section
3. Create a new API key
4. Copy the key and add it to your environment variables

## Domain Verification

For production use, you should verify your domain:

1. Go to Resend dashboard → Domains
2. Add your domain (e.g., memorialqr.com)
3. Add the provided DNS records to your domain
4. Wait for verification (usually takes a few minutes)

## Email Templates

The application sends two types of emails:

### 1. Customer Order Confirmation
- Sent to: Customer's email address
- From: orders@memorialqr.com
- Contains: Order details, shipping address, next steps

### 2. Admin Order Notification
- Sent to: Admin email (from ADMIN_EMAIL env var)
- From: orders@memorialqr.com
- Contains: New order alert with customer and order details

## Testing

For development/testing:
- Use Resend's test mode
- Emails will be sent but not delivered
- View sent emails in Resend dashboard

## Customization

To customize email templates, edit the HTML generation functions in `lib/email.ts`:
- `generateOrderConfirmationHTML()` - Customer confirmation email
- `generateAdminNotificationHTML()` - Admin notification email

## Troubleshooting

If emails aren't sending:
1. Check that RESEND_API_KEY is set correctly
2. Verify your domain is verified in Resend
3. Check Resend dashboard for error logs
4. Ensure "from" email domain matches your verified domain
