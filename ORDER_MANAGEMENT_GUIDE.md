# Order Management System Guide

This guide explains how to use the complete order management system for Memorial QR.

## Overview

The order management system handles the entire customer journey from purchase to memorial creation:

1. **Order Creation** - Automatically created when customer completes payment
2. **Email Notifications** - Sent to customer and admin
3. **Admin Dashboard** - View and manage all orders
4. **Memorial Creation** - Link orders to digital memorials

## Features

### 1. Automatic Order Creation

When a customer completes checkout:
- Order record is created in database
- Unique order number is generated (format: ORD-{timestamp}-{random})
- Customer information and shipping details are stored
- Payment information is linked
- Order status is set to "processing"

### 2. Email Notifications

Two emails are automatically sent:

**Customer Confirmation Email:**
- Order details and summary
- Shipping address confirmation
- Next steps and timeline
- Support contact information

**Admin Notification Email:**
- New order alert
- Customer and order details
- Action required notification

**Setup Required:**
- Add `RESEND_API_KEY` environment variable
- Optionally add `ADMIN_EMAIL` for admin notifications
- See EMAIL_SETUP.md for detailed instructions

### 3. Admin Dashboard

Access at `/admin/orders` to:

**View Orders:**
- See all orders with filtering and search
- View order statistics (total, processing, completed, revenue)
- Filter by status (pending, processing, completed, cancelled)
- Search by order number, customer name, or email

**Manage Orders:**
- Update order status
- Add admin notes
- View customer and shipping information
- Track payment status

**Create Memorials:**
- Create digital memorial directly from order
- Automatically links memorial to order
- Memorial appears in customer's order confirmation

### 4. Memorial Creation

**Automatic Creation (Recommended):**
Admins can create memorials from the admin dashboard:
1. Find the order without a memorial
2. Click "Create Memorial" button
3. Fill in memorial details:
   - Full name
   - Birth and death dates
   - Location
   - Biography
4. Memorial is created and linked to order

**Manual Creation:**
Customers can also create memorials via the create-memorial page (requires order number).

## Order Statuses

- **pending** - Order received, awaiting processing
- **processing** - Order is being fulfilled
- **completed** - Order fulfilled and shipped
- **cancelled** - Order cancelled

## Payment Statuses

- **pending** - Payment not yet processed
- **completed** - Payment successful
- **failed** - Payment failed
- **refunded** - Payment refunded

## Database Schema

The orders table includes:
- Order identification (id, order_number)
- Customer information (name, email, phone)
- Shipping address (full address details)
- Payment information (payment_id, amount, status)
- Product details (type, name, quantity)
- Memorial link (memorial_id)
- Admin notes and timestamps

## Workflow

### Typical Order Flow:

1. **Customer Checkout**
   - Customer fills out checkout form
   - Enters shipping and payment information
   - Completes payment via Square

2. **Order Creation**
   - System creates order record
   - Sends confirmation email to customer
   - Sends notification email to admin
   - Redirects customer to confirmation page

3. **Admin Processing**
   - Admin receives email notification
   - Reviews order in admin dashboard
   - Creates digital memorial
   - Updates order status to "processing"

4. **Memorial Creation**
   - Admin creates memorial with customer's loved one's information
   - Memorial is automatically linked to order
   - Customer can access memorial via unique URL

5. **Order Completion**
   - Physical product is manufactured and shipped
   - Admin updates order status to "completed"
   - Customer receives tracking information

## Best Practices

1. **Process Orders Promptly**
   - Check admin dashboard daily for new orders
   - Create memorials within 24 hours of order

2. **Keep Customers Informed**
   - Update order status as it progresses
   - Add admin notes for internal tracking

3. **Quality Control**
   - Review memorial information before creating
   - Verify customer details match order

4. **Customer Support**
   - Monitor admin email for new orders
   - Respond to customer inquiries promptly
   - Use admin notes to track special requests

## Troubleshooting

**Orders not appearing:**
- Check database connection
- Verify Supabase integration is active
- Check browser console for errors

**Emails not sending:**
- Verify RESEND_API_KEY is set
- Check Resend dashboard for errors
- Ensure domain is verified in Resend

**Memorial creation fails:**
- Check required fields are filled
- Verify database permissions
- Check browser console for errors

## Security

- Row Level Security (RLS) is enabled on orders table
- Customers can only view their own orders (by email)
- Admin access requires service role permissions
- Payment information is stored securely

## Support

For technical issues or questions:
- Check application logs for errors
- Review Supabase dashboard for database issues
- Contact Vercel support for deployment issues
