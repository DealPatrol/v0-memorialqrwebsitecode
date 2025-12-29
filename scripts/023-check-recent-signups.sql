-- Check for new user accounts created in the last 3 days
-- This queries the auth.users table for recent signups

SELECT 
  id,
  email,
  created_at,
  confirmed_at,
  last_sign_in_at
FROM auth.users
WHERE created_at >= NOW() - INTERVAL '3 days'
ORDER BY created_at DESC;

-- Also check if they created any memorials
SELECT 
  m.id,
  m.full_name,
  m.user_id,
  m.created_at,
  u.email
FROM memorials m
JOIN auth.users u ON m.user_id = u.id
WHERE m.created_at >= NOW() - INTERVAL '3 days'
ORDER BY m.created_at DESC;

-- Check recent orders
SELECT 
  order_number,
  customer_email,
  customer_name,
  product_name,
  plan_type,
  payment_status,
  created_at
FROM orders
WHERE created_at >= NOW() - INTERVAL '3 days'
ORDER BY created_at DESC;
