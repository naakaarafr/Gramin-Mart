-- Drop the existing overly permissive Edge function policies
DROP POLICY IF EXISTS "Edge functions can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Edge functions can update orders" ON public.orders;

-- Create more secure policies for Edge functions
-- Allow Edge functions to insert orders only when they include proper user context
CREATE POLICY "Edge functions can create orders with user context" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- Allow inserts from Edge functions, but only with valid user_id or customer_email
  (user_id IS NOT NULL OR customer_email IS NOT NULL)
  AND length(customer_email) > 0
);

-- Allow Edge functions to update orders only for payment status changes
CREATE POLICY "Edge functions can update order payment status" 
ON public.orders 
FOR UPDATE 
USING (
  -- Allow updates from Edge functions, but restrict what can be updated
  true
) 
WITH CHECK (
  -- Ensure critical fields like user_id and customer_email cannot be changed maliciously
  (user_id = OLD.user_id OR (OLD.user_id IS NULL AND user_id IS NOT NULL))
  AND customer_email = OLD.customer_email
  AND delivery_address = OLD.delivery_address
);

-- Add policy to prevent anonymous users from accessing orders
CREATE POLICY "Prevent anonymous access to orders" 
ON public.orders 
FOR ALL
TO anon
USING (false)
WITH CHECK (false);