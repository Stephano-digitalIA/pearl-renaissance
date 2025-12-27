import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { stripePromise } from '@/lib/stripe';
import { createPaymentIntent } from '@/services/stripe';
import CheckoutForm from './CheckoutForm';
import { Product } from '@/types/oceane';
import { useLocale } from '@/contexts/LocaleContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Product[];
  total: number;
  onPaymentSuccess: () => void;
}

type PaymentStep = 'loading' | 'payment' | 'success' | 'error';

const PaymentModal = ({
  isOpen,
  onClose,
  cartItems,
  total,
  onPaymentSuccess,
}: PaymentModalProps) => {
  const { formatPrice, t } = useLocale();
  const [step, setStep] = useState<PaymentStep>('loading');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && total > 0) {
      initializePayment();
    }
  }, [isOpen, total]);

  const initializePayment = async () => {
    setStep('loading');
    setError(null);

    try {
      const { clientSecret } = await createPaymentIntent({
        amount: total,
        currency: 'eur',
        metadata: {
          items: JSON.stringify(cartItems.map((item) => item.id)),
        },
      });
      setClientSecret(clientSecret);
      setStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      setStep('error');
    }
  };

  const handleSuccess = () => {
    setStep('success');
    setTimeout(() => {
      onPaymentSuccess();
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (step !== 'loading') {
      setClientSecret(null);
      setStep('loading');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-pearl-black/70 z-[80] transition-opacity duration-300"
        onClick={step !== 'loading' ? handleClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="bg-card w-full max-w-md rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="font-serif text-xl text-foreground">
              {t('cart.securePayment') || 'Secure Payment'}
            </h2>
            {step !== 'loading' && (
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'loading' && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-ocean-dark mb-4" />
                <p className="text-muted-foreground">
                  {t('cart.preparingPayment') || 'Preparing payment...'}
                </p>
              </div>
            )}

            {step === 'error' && (
              <div className="text-center py-8">
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded mb-4">
                  <p className="text-destructive">{error}</p>
                </div>
                <button
                  onClick={initializePayment}
                  className="bg-ocean-dark text-primary-foreground px-6 py-2 rounded hover:bg-ocean-teal transition-colors"
                >
                  {t('cart.tryAgain') || 'Try Again'}
                </button>
              </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="font-serif text-xl text-foreground mb-2">
                  {t('cart.paymentSuccess') || 'Payment Successful!'}
                </h3>
                <p className="text-muted-foreground text-center">
                  {t('cart.thankYou') || 'Thank you for your order.'}
                </p>
              </div>
            )}

            {step === 'payment' && clientSecret && stripePromise && (
              <>
                {/* Order Summary */}
                <div className="mb-6 p-4 bg-muted rounded">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">
                    {t('cart.orderSummary') || 'Order Summary'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    {cartItems.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="flex justify-between">
                        <span className="text-foreground">{item.name}</span>
                        <span className="text-muted-foreground">{formatPrice(item.price)}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 mt-2 flex justify-between font-medium">
                      <span className="text-foreground">{t('cart.total')}</span>
                      <span className="text-foreground">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Stripe Elements */}
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#0d6e6e',
                        borderRadius: '4px',
                      },
                    },
                  }}
                >
                  <CheckoutForm onSuccess={handleSuccess} onCancel={handleClose} />
                </Elements>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;
