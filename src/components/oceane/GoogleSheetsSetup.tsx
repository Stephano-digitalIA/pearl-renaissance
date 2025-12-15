import { useState, useEffect } from 'react';
import { Settings, X, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { getGoogleSheetsWebhook, setGoogleSheetsWebhook } from '@/services/googleSheetsService';
import { useToast } from '@/hooks/use-toast';

interface GoogleSheetsSetupProps {
  isOpen: boolean;
  onClose: () => void;
}

const APPS_SCRIPT_CODE = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  // Add headers if first row is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Latitude', 'Longitude', 'City', 'Region', 'Country', 'Source', 'User Agent']);
  }
  
  sheet.appendRow([
    data.timestamp,
    data.latitude,
    data.longitude,
    data.city,
    data.region,
    data.country,
    data.source,
    data.userAgent
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}`;

const GoogleSheetsSetup = ({ isOpen, onClose }: GoogleSheetsSetupProps) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const existingUrl = getGoogleSheetsWebhook();
    if (existingUrl) {
      setWebhookUrl(existingUrl);
      setSaved(true);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!webhookUrl.includes('script.google.com')) {
      toast({
        title: 'URL invalide',
        description: 'Veuillez entrer une URL Google Apps Script valide',
        variant: 'destructive',
      });
      return;
    }

    setGoogleSheetsWebhook(webhookUrl);
    setSaved(true);
    toast({
      title: 'Configuration sauvegardée',
      description: 'Les positions seront maintenant enregistrées dans Google Sheets',
    });
    onClose();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Code copié',
      description: 'Le code Apps Script a été copié dans le presse-papiers',
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-pearl-black/50 z-[80]" 
        onClick={onClose}
      />
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[80vh] bg-card rounded-lg shadow-2xl z-[90] overflow-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex justify-between items-center">
          <h2 className="font-serif text-xl text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-ocean-teal" />
            Configuration Google Sheets
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-ocean-teal text-primary-foreground text-sm flex items-center justify-center">1</span>
              Créer une Google Sheet
            </h3>
            <p className="text-sm text-muted-foreground pl-8">
              Créez une nouvelle feuille Google Sheets pour stocker les données de localisation.
            </p>
            <a
              href="https://sheets.new"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-8 inline-flex items-center gap-2 text-sm text-ocean-teal hover:underline"
            >
              Créer une nouvelle Sheet <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-ocean-teal text-primary-foreground text-sm flex items-center justify-center">2</span>
              Ajouter le script
            </h3>
            <p className="text-sm text-muted-foreground pl-8">
              Dans Google Sheets : <strong>Extensions → Apps Script</strong>, puis collez ce code :
            </p>
            <div className="ml-8 relative">
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto text-foreground">
                {APPS_SCRIPT_CODE}
              </pre>
              <button
                onClick={copyCode}
                className="absolute top-2 right-2 p-2 bg-card rounded border border-border hover:bg-muted transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-ocean-teal" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-ocean-teal text-primary-foreground text-sm flex items-center justify-center">3</span>
              Déployer en tant qu'application web
            </h3>
            <p className="text-sm text-muted-foreground pl-8">
              Dans Apps Script : <strong>Déployer → Nouvelle déploiement → Application Web</strong>
            </p>
            <ul className="text-sm text-muted-foreground pl-8 list-disc list-inside space-y-1">
              <li>Exécuter en tant que : <strong>Moi</strong></li>
              <li>Qui a accès : <strong>Tout le monde</strong></li>
              <li>Cliquez sur "Déployer" et copiez l'URL</li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-ocean-teal text-primary-foreground text-sm flex items-center justify-center">4</span>
              Coller l'URL du webhook
            </h3>
            <div className="pl-8">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => {
                  setWebhookUrl(e.target.value);
                  setSaved(false);
                }}
                placeholder="https://script.google.com/macros/s/..."
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ocean-teal"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!webhookUrl}
              className="px-6 py-2 bg-ocean-teal text-primary-foreground rounded-lg text-sm font-medium hover:bg-ocean-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saved ? 'Mettre à jour' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoogleSheetsSetup;
