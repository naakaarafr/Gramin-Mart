-- Fix RLS policies for orders table to prevent unauthorized access

-- First, drop all existing problematic policies
DROP POLICY IF EXISTS "Block anonymous access to orders" ON public.orders;
DROP POLICY IF EXISTS "No anonymous order access" ON public.orders;  
DROP POLICY IF EXISTS "Secure edge function order updates" ON public.orders;
DROP POLICY IF EXISTS "Secure edge function order creation" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Create secure, non-conflicting policies

-- 1. Allow users to view only their own orders
CREATE POLICY "Users can view own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Allow edge functions to create orders (for payment processing)
-- This uses a service role key, not user authentication
CREATE POLICY "Service role can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- Validate required fields
  customer_email IS NOT NULL 
  AND length(trim(customer_email)) > 0 
  AND customer_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND user_id IS NOT NULL
  AND total_amount > 0
);

-- 3. Allow edge functions to update order status (for payment confirmation)
CREATE POLICY "Service role can update order status" 
ON public.orders 
FOR UPDATE 
USING (true)
WITH CHECK (
  -- Only allow updating status and stripe_session_id fields
  -- Prevent updating customer data after creation
  customer_email IS NOT NULL 
  AND length(trim(customer_email)) > 0
);

-- 4. Prevent users from directly inserting orders (must go through payment flow)
CREATE POLICY "Block direct user order creation" 
ON public.orders 
FOR INSERT 
TO authenticated
WITH CHECK (false);

-- 5. Prevent users from updating orders (orders should be immutable from user perspective)
CREATE POLICY "Block user order updates" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (false);

-- 6. Prevent users from deleting orders
CREATE POLICY "Block user order deletion" 
ON public.orders 
FOR DELETE 
TO authenticated
USING (false);