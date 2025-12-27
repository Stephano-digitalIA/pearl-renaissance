import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

/**
 * Get all orders for the current authenticated user
 */
export async function getUserOrders(): Promise<OrderWithItems[]> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Failed to fetch orders');
  }

  return data as OrderWithItems[];
}

/**
 * Get a single order by ID (only if it belongs to the current user)
 */
export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(error.message || 'Failed to fetch order');
  }

  return data as OrderWithItems;
}

/**
 * Get orders by email (for guest checkout - requires the order's customer_email)
 */
export async function getOrderByPaymentIntent(paymentIntentId: string): Promise<OrderWithItems | null> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('stripe_payment_intent_id', paymentIntentId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(error.message || 'Failed to fetch order');
  }

  return data as OrderWithItems;
}
