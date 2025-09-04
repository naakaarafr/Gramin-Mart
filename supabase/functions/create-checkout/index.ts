import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  farmer: {
    name: string;
    location: string;
    rating: number;
  };
  quantity: number;
}

interface CheckoutRequest {
  items: CartItem[];
  totalPrice: number;
  deliveryCost: number;
  finalTotal: number;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🛒 Starting checkout process");

    // Get Stripe secret key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    // Initialize Supabase client with service role for database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user from auth header (optional for guest checkout)
    let user = null;
    let userEmail = "guest@kisanmarketplace.in";
    
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data: userData } = await supabaseService.auth.getUser(token);
        user = userData.user;
        if (user?.email) {
          userEmail = user.email;
        }
        console.log("👤 User authenticated:", userEmail);
      } catch (error) {
        console.log("⚠️ Auth failed, proceeding as guest");
      }
    }

    // Parse request body
    const { items, totalPrice, deliveryCost, finalTotal, deliveryAddress }: CheckoutRequest = await req.json();
    
    if (!items || items.length === 0) {
      throw new Error("No items in cart");
    }

    console.log(`🛍️ Processing ${items.length} items for ₹${totalPrice} + delivery ₹${deliveryCost} = ₹${finalTotal}`);

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer exists, create if not
    let customerId;
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("🔍 Found existing customer:", customerId);
    } else {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          source: "kisan-marketplace"
        }
      });
      customerId = customer.id;
      console.log("✨ Created new customer:", customerId);
    }

    // Create order in database first
    const orderData = {
      user_id: user?.id || null,
      customer_email: userEmail,
      total_amount: finalTotal,
      currency: 'inr',
      status: 'pending',
      delivery_address: deliveryAddress || null,
    };

    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error("❌ Failed to create order:", orderError);
      throw new Error("Failed to create order");
    }

    console.log("📦 Created order:", order.id);

    // Insert order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_image: item.image,
      farmer_name: item.farmer.name,
      farmer_location: item.farmer.location,
      price: item.price,
      quantity: item.quantity,
      unit: item.unit,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabaseService
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error("❌ Failed to create order items:", itemsError);
      throw new Error("Failed to create order items");
    }

    console.log("📝 Created order items");

    // Create Stripe line items
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: `${item.name} (${item.farmer.name})`,
          description: `Fresh ${item.name} from ${item.farmer.location}`,
          images: [item.image],
          metadata: {
            farmer: item.farmer.name,
            location: item.farmer.location,
            unit: item.unit,
          }
        },
        unit_amount: Math.round(item.price * 100), // Convert to paise
      },
      quantity: item.quantity,
    }));

    // Add delivery charge as a line item if applicable
    if (deliveryCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Delivery Charges',
            description: 'Home delivery service',
          },
          unit_amount: Math.round(deliveryCost * 100), // Convert to paise
        },
        quantity: 1,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cart?cancelled=true`,
      metadata: {
        order_id: order.id,
        user_email: userEmail,
      },
      shipping_address_collection: {
        allowed_countries: ['IN'],
      },
      phone_number_collection: {
        enabled: true,
      },
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
    });

    // Update order with Stripe session ID
    await supabaseService
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    console.log("💳 Created Stripe session:", session.id);

    return new Response(
      JSON.stringify({ 
        url: session.url,
        orderId: order.id,
        sessionId: session.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("🚨 Checkout error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});