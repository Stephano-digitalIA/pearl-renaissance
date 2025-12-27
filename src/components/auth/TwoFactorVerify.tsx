import { useState, useEffect, useRef } from 'react';
import { Shield, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  getFactors,
  createChallenge,
  verifyChallengeWithCode,
  TwoFactorFactor,
} from '@/services/twoFactor';

interface TwoFactorVerifyProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const TwoFactorVerify = ({ onSuccess, onCancel }: TwoFactorVerifyProps) => {
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [factor, setFactor] = useState<TwoFactorFactor | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initializeChallenge();
  }, []);

  useEffect(() => {
    if (!initializing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [initializing]);

  const initializeChallenge = async () => {
    setInitializing(true);
    setError(null);

    // Get the verified TOTP factor
    const { data: factors, error: factorsError } = await getFactors();

    if (factorsError || !factors || factors.length === 0) {
      setError('Aucun facteur 2FA configuré');
      setInitializing(false);
      return;
    }

    const verifiedFactor = factors.find((f) => f.status === 'verified');
    if (!verifiedFactor) {
      setError('Aucun facteur 2FA vérifié');
      setInitializing(false);
      return;
    }

    setFactor(verifiedFactor);

    // Create a challenge
    const { challengeId: newChallengeId, error: challengeError } = await createChallenge(
      verifiedFactor.id
    );

    if (challengeError || !newChallengeId) {
      setError(challengeError?.message || 'Erreur lors de la création du défi');
      setInitializing(false);
      return;
    }

    setChallengeId(newChallengeId);
    setInitializing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factor || !challengeId || code.length !== 6) return;

    setLoading(true);
    setError(null);

    const { success, error: verifyError } = await verifyChallengeWithCode(
      factor.id,
      challengeId,
      code
    );

    if (verifyError || !success) {
      setError(verifyError?.message || 'Code invalide. Veuillez réessayer.');
      setCode('');
      setLoading(false);

      // Create a new challenge for retry
      const { challengeId: newChallengeId } = await createChallenge(factor.id);
      if (newChallengeId) {
        setChallengeId(newChallengeId);
      }
      return;
    }

    onSuccess();
  };

  const handleCodeChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setCode(numericValue);

    // Auto-submit when 6 digits are entered
    if (numericValue.length === 6 && factor && challengeId) {
      setTimeout(() => {
        const form = document.getElementById('2fa-form') as HTMLFormElement;
        form?.requestSubmit();
      }, 100);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Vérification en deux étapes</CardTitle>
        </div>
        <CardDescription>
          Entrez le code de votre application d'authentification
        </CardDescription>
      </CardHeader>

      <form id="2fa-form" onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {initializing ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="code">Code de vérification</Label>
              <Input
                ref={inputRef}
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="text-center text-2xl tracking-widest font-mono"
                autoComplete="one-time-code"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground text-center">
                Ouvrez votre application d'authentification et entrez le code à 6 chiffres
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={loading || initializing || code.length !== 6}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              'Vérifier'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
