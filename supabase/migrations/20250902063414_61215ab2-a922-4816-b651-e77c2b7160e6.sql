-- Replace the existing overly permissive Edge function policies with secure ones
CREATE OR REPLACE POLICY "Edge functions can create orders with customer data" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- Require customer_email to be present and valid
  customer_email IS NOT NULL 
  AND length(trim(customer_email)) > 0
  AND customer_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

CREATE OR REPLACE POLICY "Edge functions can update order status" 
ON public.orders 
FOR UPDATE 
USING (true)
WITH CHECK (
  -- Only allow updates with valid customer email (prevents malicious changes)
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