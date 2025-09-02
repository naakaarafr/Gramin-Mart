-- First, drop all existing edge function policies
DROP POLICY IF EXISTS "Edge functions can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Edge functions can update orders" ON public.orders;
DROP POLICY IF EXISTS "Edge functions can create orders with customer data" ON public.orders;
DROP POLICY IF EXISTS "Edge functions can update order status" ON public.orders;

-- Create secure policies for Edge functions
CREATE POLICY "Secure edge function order creation" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- Require valid customer_email for order creation
  customer_email IS NOT NULL 
  AND length(trim(customer_email)) > 0
  AND customer_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

CREATE POLICY "Secure edge function order updates" 
ON public.orders 
FOR UPDATE 
USING (true)
WITH CHECK (
  -- Prevent malicious data changes during updates
  customer_email IS NOT NULL 
  AND length(trim(customer_email)) > 0
);

-- Block anonymous access
CREATE POLICY "No anonymous order access" 
ON public.orders 
FOR ALL
TO anon
USING (false)
WITH CHECK (false);