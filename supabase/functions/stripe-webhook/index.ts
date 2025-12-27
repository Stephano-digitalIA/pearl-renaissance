import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

// Types for order items from metadata
interface OrderItem {
  id: number;
  name: string;
  price: number; // in cents
  quantity: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode?: string;
  country: string;
}

// Send confirmation email via Resend
async function sendConfirmationEmail(
  resendApiKey: string,
  to: string,
  orderData: {
    orderId: string;
    customerName?: string;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
    currency: string;
    shippingAddress?: ShippingAddress;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const currencySymbol = orderData.currency.toUpperCase() === 'EUR' ? '€' :
                           orderData.currency.toUpperCase() === 'USD' ? '$' :
                           orderData.currency.toUpperCase();

    const formatPrice = (cents: number) => `${(cents / 100).toFixed(2)} ${currencySymbol}`;

    // Build items HTML
    const itemsHtml = orderData.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
      </tr>
    `).join('');

    // Build shipping address HTML
    const shippingHtml = orderData.shippingAddress ? `
      <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">Adresse de livraison</h3>
        <p style="margin: 0; color: #666;">
          ${orderData.shippingAddress.address}<br>
          ${orderData.shippingAddress.postalCode ? orderData.shippingAddress.postalCode + ' ' : ''}${orderData.shippingAddress.city}<br>
          ${orderData.shippingAddress.country}
        </p>
      </div>
    ` : '';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmation de commande</title>
      </head>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #d4af37;">
          <h1 style="color: #1a1a2e; margin: 0;">Pearl Renaissance</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Perles de Tahiti d'exception</p>
        </div>

        <div style="padding: 30px 0;">
          <h2 style="color: #1a1a2e;">Merci pour votre commande${orderData.customerName ? ', ' + orderData.customerName : ''} !</h2>
          <p style="color: #666;">Votre commande <strong>#${orderData.orderId.slice(0, 8).toUpperCase()}</strong> a été confirmée.</p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #1a1a2e; color: white;">
                <th style="padding: 12px; text-align: left;">Article</th>
                <th style="padding: 12px; text-align: center;">Qté</th>
                <th style="padding: 12px; text-align: right;">Prix unit.</th>
                <th style="padding: 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="text-align: right; margin-top: 20px;">
            <p style="margin: 5px 0; color: #666;">Sous-total: <strong>${formatPrice(orderData.subtotal)}</strong></p>
            <p style="margin: 5px 0; color: #666;">Livraison: <strong>${orderData.shippingCost === 0 ? 'Gratuite' : formatPrice(orderData.shippingCost)}</strong></p>
            <p style="margin: 10px 0 0 0; font-size: 1.2em; color: #1a1a2e;">
              Total: <strong style="color: #d4af37;">${formatPrice(orderData.total)}</strong>
            </p>
          </div>

          ${shippingHtml}
        </div>

        <div style="padding: 20px; background-color: #f5f5f5; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 0; color: #666; font-size: 0.9em;">
            Vous recevrez un email de suivi dès que votre commande sera expédiée.
            Pour toute question, contactez-nous à <a href="mailto:contact@pearl-renaissance.com" style="color: #d4af37;">contact@pearl-renaissance.com</a>
          </p>
        </div>

        <div style="text-align: center; padding: 20px 0; margin-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 0.8em; margin: 0;">
            © ${new Date().getFullYear()} Pearl Renaissance. Tous droits réservés.
          </p>
        </div>
      </body>
      </html>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Pearl Renaissance <commandes@pearl-renaissance.com>',
        to: [to],
        subject: `Confirmation de commande #${orderData.orderId.slice(0, 8).toUpperCase()}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      return { success: false, error: JSON.stringify(errorData) };
    }

    console.log('Confirmation email sent to:', to);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
  const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  if (!stripeSecretKey || !stripeWebhookSecret) {
    return new Response(
      JSON.stringify({ error: "Stripe keys not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(
      JSON.stringify({ error: "Supabase keys not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response(
      JSON.stringify({ error: "No signature provided" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);

    // Initialize Supabase client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);

        // Check if order already exists (idempotency)
        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_payment_intent_id', paymentIntent.id)
          .single();

        if (existingOrder) {
          console.log("Order already exists for payment:", paymentIntent.id);
          break;
        }

        // Parse metadata
        const metadata = paymentIntent.metadata;
        const items: OrderItem[] = metadata.items ? JSON.parse(metadata.items) : [];
        const subtotal = parseInt(metadata.subtotal || '0');
        const shippingCost = parseInt(metadata.shipping_cost || '0');
        const customerEmail = metadata.customer_email || paymentIntent.receipt_email;
        const customerName = metadata.customer_name;
        const userId = metadata.user_id || null;
        const shippingAddress: ShippingAddress | null = metadata.shipping_address
          ? JSON.parse(metadata.shipping_address)
          : null;

        // Create order in database
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: userId,
            stripe_payment_intent_id: paymentIntent.id,
            status: 'paid',
            subtotal: subtotal,
            shipping_cost: shippingCost,
            total: paymentIntent.amount,
            currency: paymentIntent.currency,
            customer_email: customerEmail,
            customer_name: customerName,
            shipping_address: shippingAddress,
            metadata: {
              stripe_payment_method: paymentIntent.payment_method,
              stripe_created: paymentIntent.created,
            },
          })
          .select()
          .single();

        if (orderError) {
          console.error("Error creating order:", orderError);
          throw new Error(`Failed to create order: ${orderError.message}`);
        }

        console.log("Order created:", order.id);

        // Create order items
        if (items.length > 0) {
          const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            quantity: item.quantity,
          }));

          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

          if (itemsError) {
            console.error("Error creating order items:", itemsError);
            // Don't throw - order is created, items failed
          } else {
            console.log("Order items created:", items.length);
          }
        }

        // Send confirmation email if Resend is configured
        if (resendApiKey && customerEmail) {
          const emailResult = await sendConfirmationEmail(resendApiKey, customerEmail, {
            orderId: order.id,
            customerName,
            items,
            subtotal,
            shippingCost,
            total: paymentIntent.amount,
            currency: paymentIntent.currency,
            shippingAddress: shippingAddress || undefined,
          });

          if (!emailResult.success) {
            console.error("Failed to send confirmation email:", emailResult.error);
            // Don't throw - order is created, email failed
          }
        } else {
          console.log("Skipping email: Resend not configured or no customer email");
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const errorMessage = paymentIntent.last_payment_error?.message || 'Unknown error';

        console.error("Payment failed:", paymentIntent.id, errorMessage);

        // Log failed payment attempt (optional - create a payment_logs table if needed)
        // Could also notify admin here

        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        console.log("Charge refunded for payment intent:", paymentIntentId);

        // Update order status to refunded
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'refunded',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', paymentIntentId);

        if (updateError) {
          console.error("Error updating order status:", updateError);
        } else {
          console.log("Order marked as refunded");
        }

        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log("Payment canceled:", paymentIntent.id);

        // Update order status if exists
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);

        if (updateError) {
          console.error("Error updating order status:", updateError);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
