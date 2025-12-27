import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  id: number;
  name: string;
  price: number;
  category?: string;
}

interface PaymentRequest {
  amount: number;
  currency?: string;
  items: CartItem[];
  customerEmail?: string;
  customerName?: string;
  userId?: string;
  shippingAddress?: {
    address: string;
    city: string;
    postalCode?: string;
    country: string;
  };
  shippingCost?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const {
      amount,
      currency = "eur",
      items,
      customerEmail,
      customerName,
      userId,
      shippingAddress,
      shippingCost = 0
    }: PaymentRequest = await req.json();

    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    if (!items || items.length === 0) {
      throw new Error("Cart items are required");
    }

    // Validate items structure
    for (const item of items) {
      if (!item.id || !item.name || typeof item.price !== 'number') {
        throw new Error("Invalid item structure: each item must have id, name, and price");
      }
    }

    // Aggregate items by product ID to get quantities
    const itemQuantities: Record<number, { item: CartItem; quantity: number }> = {};
    for (const item of items) {
      if (itemQuantities[item.id]) {
        itemQuantities[item.id].quantity += 1;
      } else {
        itemQuantities[item.id] = { item, quantity: 1 };
      }
    }

    // Create metadata with all necessary info for the webhook
    const metadata: Record<string, string> = {
      // Store items as JSON with quantities
      items: JSON.stringify(
        Object.values(itemQuantities).map(({ item, quantity }) => ({
          id: item.id,
          name: item.name,
          price: Math.round(item.price * 100), // Store in cents
          quantity,
        }))
      ),
      subtotal: String(Math.round((amount - shippingCost) * 100)),
      shipping_cost: String(Math.round(shippingCost * 100)),
    };

    // Add optional fields if provided
    if (customerEmail) {
      metadata.customer_email = customerEmail;
    }
    if (customerName) {
      metadata.customer_name = customerName;
    }
    if (userId) {
      metadata.user_id = userId;
    }
    if (shippingAddress) {
      metadata.shipping_address = JSON.stringify(shippingAddress);
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
      // Add receipt email if customer email is provided
      ...(customerEmail && { receipt_email: customerEmail }),
    });

    console.log("PaymentIntent created:", paymentIntent.id, "Amount:", amount, currency.toUpperCase());

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
