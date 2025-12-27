import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Mail, Phone, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { TwoFactorManagement } from '@/components/auth';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  useShippingAddress: boolean;
}

const countries = [
  'France', 'Polynésie française', 'États-Unis', 'Allemagne', 'Espagne', 
  'Italie', 'Portugal', 'Japon', 'Chine', 'Pays-Bas', 'Belgique', 'Suisse',
  'Canada', 'Australie', 'Royaume-Uni'
];

const Profile = () => {
  const { toast } = useToast();
  const { t } = useLocale();
  
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    postalCode: '',
    city: '',
    country: 'Polynésie française',
    useShippingAddress: true,
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleChange = (field: keyof ProfileData, value: string | boolean) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    toast({
      title: "Profil sauvegardé",
      description: "Vos informations ont été mises à jour avec succès.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8 px-6">
        <div className="container mx-auto max-w-4xl">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la boutique
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl mb-2">Mon Profil</h1>
          <p className="text-primary-foreground/80">
            Gérez vos informations personnelles et adresses
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl py-8 px-6 space-y-6">
        {/* Identity Section */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl text-foreground">Identité</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Votre prénom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Votre nom"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="votre@email.com"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+689 00 00 00"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication Section */}
        <TwoFactorManagement />

        {/* Address Section */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl text-foreground">Adresse postale</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="street">Rue</Label>
              <Input
                id="street"
                value={profile.street}
                onChange={(e) => handleChange('street', e.target.value)}
                placeholder="Numéro et nom de rue"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  value={profile.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  placeholder="98713"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Votre ville"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Select 
                value={profile.country} 
                onValueChange={(value) => handleChange('country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un pays" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Shipping Checkbox */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="useShippingAddress"
            checked={profile.useShippingAddress}
            onCheckedChange={(checked) => handleChange('useShippingAddress', checked as boolean)}
          />
          <Label htmlFor="useShippingAddress" className="cursor-pointer">
            Utiliser la même adresse pour la livraison
          </Label>
        </div>

        {/* Shipping Info Banner */}
        {profile.country && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-primary" />
            <span className="text-foreground">
              Les frais de livraison seront calculés pour <strong>{profile.country}</strong>
            </span>
          </div>
        )}

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full md:w-auto">
          Sauvegarder mes informations
        </Button>
      </div>
    </div>
  );
};

export default Profile;
