import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Stripe publishable key is not configured');
}

export const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;
