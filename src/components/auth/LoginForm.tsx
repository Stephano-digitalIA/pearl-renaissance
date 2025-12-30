import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { TwoFactorVerify } from './TwoFactorVerify';
import { GoogleAuthButton } from './GoogleAuthButton';
import { getAssuranceLevel, getFactors } from '@/services/twoFactor';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

type LoginStep = 'credentials' | '2fa';

export const LoginForm = ({ onSuccess, redirectTo = '/' }: LoginFormProps) => {
  const { signIn, signOut, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<LoginStep>('credentials');
  const [checking2FA, setChecking2FA] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const { error: signInError } = await signIn({ email, password });

    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect');
      } else if (signInError.message.includes('Email not confirmed')) {
        setError('Veuillez confirmer votre email avant de vous connecter');
      } else {
        setError(signInError.message);
      }
      return;
    }

    // Check if 2FA is required
    setChecking2FA(true);
    const { data: factors } = await getFactors();
    const has2FA = factors?.some(f => f.status === 'verified') ?? false;

    if (has2FA) {
      const { currentLevel, nextLevel } = await getAssuranceLevel();

      // If user has 2FA but hasn't completed the second factor
      if (currentLevel === 'aal1' && nextLevel === 'aal2') {
        setStep('2fa');
        setChecking2FA(false);
        return;
      }
    }

    setChecking2FA(false);
    onSuccess?.();
  };

  const handle2FASuccess = () => {
    onSuccess?.();
  };

  const handle2FACancel = async () => {
    // Sign out if user cancels 2FA
    await signOut();
    setStep('credentials');
    setEmail('');
    setPassword('');
  };

  if (step === '2fa') {
    return <TwoFactorVerify onSuccess={handle2FASuccess} onCancel={handle2FACancel} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
        <CardDescription className="text-center">
          Entrez vos identifiants pour accéder à votre compte
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <GoogleAuthButton mode="login" />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continuer avec
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={loading || checking2FA}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={loading || checking2FA}
                autoComplete="current-password"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading || checking2FA}>
            {loading || checking2FA ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {checking2FA ? 'Vérification...' : 'Connexion en cours...'}
              </>
            ) : (
              'Se connecter'
            )}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Créer un compte
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};
