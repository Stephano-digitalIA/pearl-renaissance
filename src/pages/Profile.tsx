import { useState, useEffect } from 'react';
import { User, MapPin, Mail, Phone, Save, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useLocale } from '@/contexts/LocaleContext';
import { UserProfile, Address, emptyAddress } from '@/types/userProfile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countries = [
  { code: 'PF', name: 'Polynésie Française' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Allemagne' },
  { code: 'ES', name: 'Espagne' },
  { code: 'IT', name: 'Italie' },
  { code: 'GB', name: 'Royaume-Uni' },
  { code: 'BE', name: 'Belgique' },
  { code: 'CH', name: 'Suisse' },
  { code: 'NL', name: 'Pays-Bas' },
  { code: 'PT', name: 'Portugal' },
  { code: 'AT', name: 'Autriche' },
  { code: 'US', name: 'États-Unis' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australie' },
  { code: 'NZ', name: 'Nouvelle-Zélande' },
  { code: 'JP', name: 'Japon' },
  { code: 'CN', name: 'Chine' },
  { code: 'KR', name: 'Corée du Sud' },
  { code: 'SG', name: 'Singapour' },
];

const Profile = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUserProfile();
  const { t } = useLocale();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setFormData(profile);
      setIsInitialized(true);
    }
  }, [profile, isInitialized]);

  const handleInputChange = (field: keyof UserProfile, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (
    type: 'postalAddress' | 'shippingAddress',
    field: keyof Address,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleCountryChange = (
    type: 'postalAddress' | 'shippingAddress',
    code: string
  ) => {
    const country = countries.find(c => c.code === code);
    setFormData(prev => ({
      ...prev,
      [type]: { 
        ...prev[type], 
        countryCode: code,
        country: country?.name || ''
      }
    }));
  };

  const handleSave = () => {
    updateProfile(formData);
    toast({
      title: t('profile.saved'),
      description: t('profile.savedDescription'),
    });
  };

  const AddressForm = ({ 
    type, 
    title, 
    icon 
  }: { 
    type: 'postalAddress' | 'shippingAddress';
    title: string;
    icon: React.ReactNode;
  }) => (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h2 className="font-serif text-xl text-foreground mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor={`${type}-street`}>{t('profile.street')}</Label>
          <Input
            id={`${type}-street`}
            value={formData[type].street}
            onChange={(e) => handleAddressChange(type, 'street', e.target.value)}
            placeholder={t('profile.streetPlaceholder')}
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${type}-postalCode`}>{t('profile.postalCode')}</Label>
            <Input
              id={`${type}-postalCode`}
              value={formData[type].postalCode}
              onChange={(e) => handleAddressChange(type, 'postalCode', e.target.value)}
              placeholder="98713"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`${type}-city`}>{t('profile.city')}</Label>
            <Input
              id={`${type}-city`}
              value={formData[type].city}
              onChange={(e) => handleAddressChange(type, 'city', e.target.value)}
              placeholder={t('profile.cityPlaceholder')}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label>{t('profile.country')}</Label>
          <Select 
            value={formData[type].countryCode} 
            onValueChange={(code) => handleCountryChange(type, code)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={t('profile.selectCountry')} />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm mb-4 hover:text-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('profile.backToShop')}
          </button>
          <h1 className="font-serif text-3xl">{t('profile.title')}</h1>
          <p className="text-primary-foreground/80 mt-1">{t('profile.subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Identity */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="font-serif text-xl text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              {t('profile.identity')}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{t('profile.firstName')}</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder={t('profile.firstNamePlaceholder')}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">{t('profile.lastName')}</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder={t('profile.lastNamePlaceholder')}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">{t('profile.email')}</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@exemple.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">{t('profile.phone')}</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+689 87 12 34 56"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Postal Address */}
          <AddressForm 
            type="postalAddress" 
            title={t('profile.postalAddress')}
            icon={<MapPin className="w-5 h-5" />}
          />

          {/* Use same address checkbox */}
          <div className="flex items-center gap-3 px-2">
            <Checkbox
              id="usePostalAsShipping"
              checked={formData.usePostalAsShipping}
              onCheckedChange={(checked) => handleInputChange('usePostalAsShipping', !!checked)}
            />
            <Label htmlFor="usePostalAsShipping" className="cursor-pointer">
              {t('profile.useSameAddress')}
            </Label>
          </div>

          {/* Shipping Address */}
          {!formData.usePostalAsShipping && (
            <AddressForm 
              type="shippingAddress" 
              title={t('profile.shippingAddress')}
              icon={<MapPin className="w-5 h-5" />}
            />
          )}

          {/* Shipping info */}
          {(formData.usePostalAsShipping ? formData.postalAddress.countryCode : formData.shippingAddress.countryCode) && (
            <div className="bg-primary/10 rounded-xl p-4 flex items-center gap-3">
              <Check className="w-5 h-5 text-primary" />
              <p className="text-sm text-foreground">
                {t('profile.shippingCalculation')} <strong>{formData.usePostalAsShipping ? formData.postalAddress.country : formData.shippingAddress.country}</strong>
              </p>
            </div>
          )}

          {/* Save button */}
          <Button 
            onClick={handleSave}
            className="w-full md:w-auto px-8"
            size="lg"
          >
            <Save className="w-4 h-4 mr-2" />
            {t('profile.save')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
