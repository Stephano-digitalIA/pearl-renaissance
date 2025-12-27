import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/contexts/LocaleContext';

interface CheckoutFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckoutForm = ({ onSuccess, onCancel }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useLocale();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/profile?payment=success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'An error occurred during payment');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    } else {
      setErrorMessage('Payment was not completed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      {errorMessage && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 py-3 border border-border text-foreground uppercase text-sm tracking-widest hover:bg-muted transition-colors disabled:opacity-50"
        >
          {t('cart.back') || 'Back'}
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-ocean-dark text-primary-foreground py-3 uppercase text-sm tracking-widest hover:bg-ocean-teal transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('cart.processing') || 'Processing...'}
            </>
          ) : (
            t('cart.pay') || 'Pay Now'
          )}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
