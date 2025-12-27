import { useState, useEffect } from 'react';
import { Shield, ShieldCheck, ShieldOff, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TwoFactorSetup } from './TwoFactorSetup';
import {
  getFactors,
  unenrollTOTP,
  TwoFactorFactor,
} from '@/services/twoFactor';

export const TwoFactorManagement = () => {
  const [loading, setLoading] = useState(true);
  const [factors, setFactors] = useState<TwoFactorFactor[]>([]);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEnabled = factors.some((f) => f.status === 'verified');

  useEffect(() => {
    loadFactors();
  }, []);

  const loadFactors = async () => {
    setLoading(true);
    const { data, error } = await getFactors();
    if (data) {
      setFactors(data);
    }
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSetupSuccess = () => {
    setShowSetup(false);
    loadFactors();
  };

  const handleDisable = async () => {
    const verifiedFactor = factors.find((f) => f.status === 'verified');
    if (!verifiedFactor) return;

    setDisabling(true);
    setError(null);

    const { success, error } = await unenrollTOTP(verifiedFactor.id);

    if (error || !success) {
      setError(error?.message || 'Erreur lors de la désactivation');
      setDisabling(false);
      return;
    }

    setShowDisableDialog(false);
    setDisabling(false);
    loadFactors();
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <TwoFactorSetup
        onSuccess={handleSetupSuccess}
        onCancel={() => setShowSetup(false)}
      />
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-serif text-xl text-foreground">
            Authentification à deux facteurs (2FA)
          </h2>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              {isEnabled ? (
                <ShieldCheck className="w-8 h-8 text-green-500" />
              ) : (
                <ShieldOff className="w-8 h-8 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium text-foreground">
                  {isEnabled ? '2FA activée' : '2FA désactivée'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isEnabled
                    ? 'Votre compte est protégé par une authentification à deux facteurs'
                    : 'Ajoutez une couche de sécurité supplémentaire à votre compte'}
                </p>
              </div>
            </div>
          </div>

          {isEnabled ? (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>
                  Lors de votre connexion, vous devrez entrer un code généré par votre
                  application d'authentification (Google Authenticator, Authy, etc.).
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDisableDialog(true)}
              >
                Désactiver la 2FA
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>
                  L'authentification à deux facteurs ajoute une couche de sécurité
                  supplémentaire en demandant un code de vérification en plus de votre
                  mot de passe.
                </p>
              </div>
              <Button onClick={() => setShowSetup(true)}>
                <Shield className="w-4 h-4 mr-2" />
                Activer la 2FA
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Disable Confirmation Dialog */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Désactiver l'authentification à deux facteurs ?</DialogTitle>
            <DialogDescription>
              Votre compte sera moins sécurisé sans la 2FA. Êtes-vous sûr de vouloir
              continuer ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDisableDialog(false)}
              disabled={disabling}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisable}
              disabled={disabling}
            >
              {disabling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Désactivation...
                </>
              ) : (
                'Désactiver'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
