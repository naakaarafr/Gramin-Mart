-- Create products table for farmers to manage their goods
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  quantity_available INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  farmer_name TEXT NOT NULL,
  farmer_location TEXT NOT NULL,
  organic BOOLEAN DEFAULT false,
  harvest_date DATE,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for product access
CREATE POLICY "Farmers can view their own products" 
ON public.products 
FOR SELECT 
USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can create their own products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own products" 
ON public.products 
FOR DELETE 
USING (auth.uid() = farmer_id);

CREATE POLICY "Everyone can view available products" 
ON public.products 
FOR SELECT 
USING (quantity_available > 0);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_products_farmer_id ON public.products(farmer_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_location ON public.products(farmer_location);