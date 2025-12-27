import { useState } from 'react';
import { Shield, Loader2, Copy, Check, AlertCircle } from 'lucide-react';
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
  enrollTOTP,
  verifyTOTP,
  TwoFactorEnrollResponse,
} from '@/services/twoFactor';

interface TwoFactorSetupProps {
  onSuccess: () => void;
  onCancel: () => void;
}

type SetupStep = 'intro' | 'qrcode' | 'verify' | 'success';

export const TwoFactorSetup = ({ onSuccess, onCancel }: TwoFactorSetupProps) => {
  const [step, setStep] = useState<SetupStep>('intro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollData, setEnrollData] = useState<TwoFactorEnrollResponse | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [secretCopied, setSecretCopied] = useState(false);

  const handleStartSetup = async () => {
    setLoading(true);
    setError(null);

    const { data, error: enrollError } = await enrollTOTP('Pearl Renaissance App');

    if (enrollError || !data) {
      setError(enrollError?.message || 'Erreur lors de la configuration');
      setLoading(false);
      return;
    }

    setEnrollData(data);
    setStep('qrcode');
    setLoading(false);
  };

  const handleCopySecret = async () => {
    if (enrollData?.totp.secret) {
      await navigator.clipboard.writeText(enrollData.totp.secret);
      setSecretCopied(true);
      setTimeout(() => setSecretCopied(false), 2000);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollData || !verificationCode) return;

    setLoading(true);
    setError(null);

    const { success, error: verifyError } = await verifyTOTP(
      enrollData.id,
      verificationCode
    );

    if (verifyError || !success) {
      setError(verifyError?.message || 'Code invalide. Veuillez réessayer.');
      setLoading(false);
      return;
    }

    setStep('success');
    setLoading(false);
  };

  const handleComplete = () => {
    onSuccess();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">
            {step === 'success' ? 'Configuration terminée' : 'Authentification à deux facteurs'}
          </CardTitle>
        </div>
        <CardDescription>
          {step === 'intro' && 'Protégez votre compte avec une couche de sécurité supplémentaire'}
          {step === 'qrcode' && 'Scannez le QR code avec votre application d\'authentification'}
          {step === 'verify' && 'Entrez le code généré par votre application'}
          {step === 'success' && 'Votre compte est maintenant protégé par la 2FA'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'intro' && (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-medium">Comment ça marche ?</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Téléchargez une application d'authentification (Google Authenticator, Authy, etc.)</li>
                <li>Scannez le QR code avec l'application</li>
                <li>Entrez le code à 6 chiffres généré</li>
                <li>Lors de vos prochaines connexions, vous devrez entrer ce code</li>
              </ol>
            </div>
          </div>
        )}

        {step === 'qrcode' && enrollData && (
          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <img
                src={enrollData.totp.qr_code}
                alt="QR Code pour 2FA"
                className="w-48 h-48"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">
                Ou entrez ce code manuellement :
              </Label>
              <div className="flex gap-2">
                <code className="flex-1 p-2 bg-muted rounded text-sm font-mono break-all">
                  {enrollData.totp.secret}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopySecret}
                  className="shrink-0"
                >
                  {secretCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code de vérification</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest"
                autoComplete="one-time-code"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground text-center">
                Entrez le code à 6 chiffres de votre application
              </p>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-muted-foreground">
              Votre authentification à deux facteurs est maintenant active.
              Vous devrez entrer un code de vérification à chaque connexion.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        {step === 'intro' && (
          <>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleStartSetup} disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Configuration...
                </>
              ) : (
                'Commencer'
              )}
            </Button>
          </>
        )}

        {step === 'qrcode' && (
          <>
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Annuler
            </Button>
            <Button onClick={() => setStep('verify')} className="flex-1">
              J'ai scanné le code
            </Button>
          </>
        )}

        {step === 'verify' && (
          <>
            <Button variant="outline" onClick={() => setStep('qrcode')} className="flex-1">
              Retour
            </Button>
            <Button
              onClick={handleVerify}
              disabled={loading || verificationCode.length !== 6}
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
          </>
        )}

        {step === 'success' && (
          <Button onClick={handleComplete} className="w-full">
            Terminé
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
