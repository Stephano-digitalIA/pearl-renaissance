import { supabase } from '@/integrations/supabase/client';

interface CartItem {
  id: number;
  name: string;
  price: number;
  category?: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode?: string;
  country: string;
}

interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  items: CartItem[];
  customerEmail?: string;
  customerName?: string;
  userId?: string;
  shippingAddress?: ShippingAddress;
  shippingCost?: number;
}

interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export async function createPaymentIntent({
  amount,
  currency = 'eur',
  items,
  customerEmail,
  customerName,
  userId,
  shippingAddress,
  shippingCost = 0,
}: CreatePaymentIntentParams): Promise<PaymentIntentResponse> {
  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: {
      amount,
      currency,
      items,
      customerEmail,
      customerName,
      userId,
      shippingAddress,
      shippingCost,
    },
  });

  if (error) {
    throw new Error(error.message || 'Failed to create payment intent');
  }

  if (!data?.clientSecret) {
    throw new Error('Invalid response from payment service');
  }

  return data;
}
