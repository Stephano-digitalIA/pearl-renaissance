import { supabase } from '@/integrations/supabase/client';

interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export async function createPaymentIntent({
  amount,
  currency = 'eur',
  metadata = {},
}: CreatePaymentIntentParams): Promise<PaymentIntentResponse> {
  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: { amount, currency, metadata },
  });

  if (error) {
    throw new Error(error.message || 'Failed to create payment intent');
  }

  if (!data?.clientSecret) {
    throw new Error('Invalid response from payment service');
  }

  return data;
}
