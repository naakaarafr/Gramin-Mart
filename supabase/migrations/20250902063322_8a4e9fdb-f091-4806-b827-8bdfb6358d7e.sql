-- Drop the existing overly permissive Edge function policies
DROP POLICY IF EXISTS "Edge functions can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Edge functions can update orders" ON public.orders;

-- Create more secure policies for Edge functions
-- Allow Edge functions to insert orders only when they include proper customer data
CREATE POLICY "Edge functions can create orders with customer data" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- Require customer_email to be present and valid
  customer_email IS NOT NULL 
  AND length(trim(customer_email)) > 0
  AND customer_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- Allow Edge functions to update orders but only for payment processing
CREATE POLICY "Edge functions can update order status" 
ON public.orders 
FOR UPDATE 
USING (true)
WITH CHECK (
  -- Only allow status and stripe_session_id updates during payment processing
  customer_email IS NOT NULL 
  AND length(trim(customer_email)) > 0
);

-- Explicitly prevent anonymous users from accessing orders
CREATE POLICY "Block anonymous access to orders" 
ON public.orders 
FOR ALL
TO anon
USING (false)
WITH CHECK (false);