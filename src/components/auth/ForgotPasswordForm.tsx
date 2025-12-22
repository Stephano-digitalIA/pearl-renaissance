import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export const ForgotPasswordForm = () => {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Email envoyé !</CardTitle>
          <CardDescription className="text-center">
            Si un compte existe avec l'adresse <strong>{email}</strong>,
            vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link to="/login">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Mot de passe oublié</CardTitle>
        <CardDescription className="text-center">
          Entrez votre email pour recevoir un lien de réinitialisation
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
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              'Envoyer le lien'
            )}
          </Button>

          <Link to="/login" className="text-sm text-center text-muted-foreground hover:text-primary">
            <ArrowLeft className="inline mr-1 h-4 w-4" />
            Retour à la connexion
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
};
