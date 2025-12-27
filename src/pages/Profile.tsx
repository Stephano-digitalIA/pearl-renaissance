import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Mail, Phone, Check, Package, Loader2, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocale } from '@/contexts/LocaleContext';
import { useAuth } from '@/contexts/AuthContext';
import { TwoFactorManagement } from '@/components/auth';
import { getUserOrders, OrderWithItems } from '@/services/orders';

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

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'En attente', variant: 'secondary' },
  paid: { label: 'Payée', variant: 'default' },
  shipped: { label: 'Expédiée', variant: 'default' },
  delivered: { label: 'Livrée', variant: 'default' },
  cancelled: { label: 'Annulée', variant: 'destructive' },
  refunded: { label: 'Remboursée', variant: 'outline' },
};

const Profile = () => {
  const { toast } = useToast();
  const { t, formatPrice } = useLocale();
  const { user } = useAuth();

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

  // Orders state
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setOrdersLoading(false);
        return;
      }

      try {
        setOrdersLoading(true);
        setOrdersError(null);
        const userOrders = await getUserOrders();
        setOrders(userOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrdersError(err instanceof Error ? err.message : 'Erreur lors du chargement des commandes');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatOrderPrice = (cents: number, currency: string) => {
    const amount = cents / 100;
    const symbol = currency.toUpperCase() === 'EUR' ? '€' :
                   currency.toUpperCase() === 'USD' ? '$' : currency.toUpperCase();
    return `${amount.toFixed(2)} ${symbol}`;
  };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
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
            Gérez vos informations personnelles et consultez vos commandes
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl py-8 px-6 space-y-6">

        {/* Orders Section */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl text-foreground">Mes commandes</h2>
          </div>

          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Chargement des commandes...</span>
            </div>
          ) : ordersError ? (
            <div className="text-center py-8">
              <p className="text-destructive">{ordersError}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">Vous n'avez pas encore de commandes</p>
              <Link to="/">
                <Button variant="outline" className="mt-4">
                  Découvrir nos bijoux
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                const statusInfo = statusLabels[order.status] || { label: order.status, variant: 'secondary' as const };

                return (
                  <div
                    key={order.id}
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    {/* Order Header */}
                    <div
                      className="p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium text-foreground">
                              Commande #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                          <span className="font-semibold text-foreground">
                            {formatOrderPrice(order.total, order.currency)}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Details (Expanded) */}
                    {isExpanded && (
                      <div className="p-4 border-t border-border">
                        {/* Order Items */}
                        <div className="space-y-3 mb-4">
                          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Articles
                          </h4>
                          {order.order_items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
                            >
                              <div>
                                <p className="font-medium text-foreground">{item.product_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Quantité: {item.quantity}
                                </p>
                              </div>
                              <p className="text-foreground">
                                {formatOrderPrice(item.product_price * item.quantity, order.currency)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Order Summary */}
                        <div className="pt-4 border-t border-border space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Sous-total</span>
                            <span className="text-foreground">
                              {formatOrderPrice(order.subtotal, order.currency)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Livraison</span>
                            <span className="text-foreground">
                              {order.shipping_cost === 0
                                ? 'Gratuite'
                                : formatOrderPrice(order.shipping_cost, order.currency)
                              }
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold pt-2 border-t border-border">
                            <span className="text-foreground">Total</span>
                            <span className="text-primary">
                              {formatOrderPrice(order.total, order.currency)}
                            </span>
                          </div>
                        </div>

                        {/* Customer Email */}
                        {order.customer_email && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                              Confirmation envoyée à: <span className="text-foreground">{order.customer_email}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
