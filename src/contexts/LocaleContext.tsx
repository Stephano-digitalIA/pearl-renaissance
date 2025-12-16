import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'fr' | 'en';
export type Currency = 'XPF' | 'EUR' | 'USD';

interface LocaleConfig {
  locale: Locale;
  currency: Currency;
  currencySymbol: string;
  exchangeRate: number; // relative to XPF
}

const localeConfigs: Record<string, LocaleConfig> = {
  // French Polynesia (default)
  PF: { locale: 'fr', currency: 'XPF', currencySymbol: 'XPF', exchangeRate: 1 },
  // France / Europe
  FR: { locale: 'fr', currency: 'EUR', currencySymbol: '€', exchangeRate: 0.00838 },
  // USA
  US: { locale: 'en', currency: 'USD', currencySymbol: '$', exchangeRate: 0.0091 },
  // UK
  GB: { locale: 'en', currency: 'USD', currencySymbol: '$', exchangeRate: 0.0091 },
  // Default fallback
  default: { locale: 'fr', currency: 'XPF', currencySymbol: 'XPF', exchangeRate: 1 },
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  currency: Currency;
  currencySymbol: string;
  formatPrice: (priceXPF: number) => string;
  t: (key: string) => string;
  countryCode: string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Translations
const translations: Record<Locale, Record<string, string>> = {
  fr: {
    // Navbar
    'nav.collections': 'Collections',
    'nav.story': "L'Histoire",
    'nav.workshop': "L'Atelier",
    'nav.cart': 'Panier',
    
    // Hero
    'hero.tagline': 'Authenticité & Luxe',
    'hero.title': "L'Élégance née des",
    'hero.titleAccent': 'Profondeurs',
    'hero.description': 'Découvrez la magie des perles noires de Tahiti, cultivées avec passion dans les eaux cristallines de Polynésie.',
    'hero.cta': 'Explorer la Collection',
    'hero.discover': 'Découvrir',
    
    // Collections
    'collections.tagline': 'Nos Créations',
    'collections.title': 'Les Collections',
    'collections.all': 'Tous',
    'collections.addToCart': 'Ajouter au panier',
    
    // Story
    'story.tagline': 'Notre Histoire',
    'story.title': "L'Art de la Perle",
    'story.p1': "Depuis trois générations, notre famille cultive les perles noires dans les lagons préservés des Tuamotu. Chaque perle est le fruit d'un savoir-faire transmis et d'une passion pour l'excellence.",
    'story.p2': "Nos artisans sélectionnent minutieusement chaque perle pour créer des bijoux d'exception, alliant tradition polynésienne et design contemporain.",
    'story.cta': 'Découvrir notre atelier',
    
    // Testimonials
    'testimonials.tagline': 'Témoignages',
    'testimonials.title': 'Ce Que Disent Nos Clientes',
    
    // Newsletter
    'newsletter.tagline': 'Newsletter',
    'newsletter.title': 'Restez Informée',
    'newsletter.description': 'Recevez en avant-première nos nouvelles collections et offres exclusives.',
    'newsletter.placeholder': 'Votre email',
    'newsletter.cta': "S'inscrire",
    'newsletter.success': 'Merci pour votre inscription !',
    
    // Footer
    'footer.rights': 'Tous droits réservés',
    'footer.contact': 'Contact',
    'footer.legal': 'Mentions légales',
    'footer.privacy': 'Confidentialité',
    
    // Cart
    'cart.title': 'Votre Panier',
    'cart.empty': 'Votre panier est vide',
    'cart.total': 'Total',
    'cart.checkout': 'Commander',
    'cart.remove': 'Retirer',
    
    // Shipping
    'shipping.title': 'Livraison & Services',
    'shipping.worldwide': 'Livraison Mondiale',
    'shipping.worldwideDesc': 'Expédition sécurisée partout dans le monde',
    'shipping.certificate': 'Certificat d\'Authenticité',
    'shipping.certificateDesc': 'Chaque bijou accompagné de son certificat',
    'shipping.packaging': 'Écrin de Luxe',
    'shipping.packagingDesc': 'Présentation soignée dans un écrin premium',
    
    // Location
    'location.detected': 'Livraison vers',
    'location.shipping': 'Frais de port estimés',
    
    // Product Manager
    'manager.title': 'Gestion du Catalogue',
    'manager.add': 'Ajouter un produit',
    'manager.reset': 'Réinitialiser',
    'manager.image': 'Image',
    'manager.name': 'Nom',
    'manager.category': 'Catégorie',
    'manager.price': 'Prix',
    'manager.actions': 'Actions',
    
    // Product Form
    'form.addTitle': 'Ajouter un produit',
    'form.editTitle': 'Modifier le produit',
    'form.productName': 'Nom du produit',
    'form.productNamePlaceholder': 'Ex: Larme du Lagon',
    'form.category': 'Catégorie',
    'form.price': 'Prix',
    'form.image': 'Image du produit',
    'form.upload': 'Upload',
    'form.url': 'URL',
    'form.uploadHint': 'Cliquez pour sélectionner une image',
    'form.maxSize': 'Max 6MB',
    'form.description': 'Description',
    'form.descriptionPlaceholder': 'Description du bijou...',
    'form.cancel': 'Annuler',
    'form.save': 'Enregistrer',
    'form.add': 'Ajouter',
    'form.imageRequired': 'Veuillez ajouter une image',
    'form.imageTypeError': 'Veuillez sélectionner une image',
    'form.imageSizeError': 'Image trop grande (max 6MB)',
    'form.storageError': "Stockage du navigateur saturé. Essayez une image plus légère.",
    'form.genericError': "Impossible d'ajouter le produit. Réessayez.",
    'form.added': 'Produit ajouté avec succès',
    'form.updated': 'Produit modifié',
    'form.deleted': 'Produit supprimé',
    'form.resetConfirm': 'Réinitialiser le catalogue ?',
    'form.resetDone': 'Catalogue réinitialisé',
    'form.deleteConfirm': 'Supprimer ce produit ?',
  },
  en: {
    // Navbar
    'nav.collections': 'Collections',
    'nav.story': 'Our Story',
    'nav.workshop': 'Workshop',
    'nav.cart': 'Cart',
    
    // Hero
    'hero.tagline': 'Authenticity & Luxury',
    'hero.title': 'Elegance Born from the',
    'hero.titleAccent': 'Depths',
    'hero.description': 'Discover the magic of Tahitian black pearls, cultivated with passion in the crystal-clear waters of Polynesia.',
    'hero.cta': 'Explore the Collection',
    'hero.discover': 'Discover',
    
    // Collections
    'collections.tagline': 'Our Creations',
    'collections.title': 'The Collections',
    'collections.all': 'All',
    'collections.addToCart': 'Add to Cart',
    
    // Story
    'story.tagline': 'Our Story',
    'story.title': 'The Art of the Pearl',
    'story.p1': 'For three generations, our family has cultivated black pearls in the preserved lagoons of the Tuamotu. Each pearl is the fruit of transmitted expertise and a passion for excellence.',
    'story.p2': 'Our artisans meticulously select each pearl to create exceptional jewelry, combining Polynesian tradition with contemporary design.',
    'story.cta': 'Discover our workshop',
    
    // Testimonials
    'testimonials.tagline': 'Testimonials',
    'testimonials.title': 'What Our Customers Say',
    
    // Newsletter
    'newsletter.tagline': 'Newsletter',
    'newsletter.title': 'Stay Informed',
    'newsletter.description': 'Be the first to receive our new collections and exclusive offers.',
    'newsletter.placeholder': 'Your email',
    'newsletter.cta': 'Subscribe',
    'newsletter.success': 'Thank you for subscribing!',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.contact': 'Contact',
    'footer.legal': 'Legal Notice',
    'footer.privacy': 'Privacy',
    
    // Cart
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    
    // Shipping
    'shipping.title': 'Shipping & Services',
    'shipping.worldwide': 'Worldwide Shipping',
    'shipping.worldwideDesc': 'Secure shipping worldwide',
    'shipping.certificate': 'Certificate of Authenticity',
    'shipping.certificateDesc': 'Each piece comes with its certificate',
    'shipping.packaging': 'Luxury Packaging',
    'shipping.packagingDesc': 'Elegant presentation in a premium case',
    
    // Location
    'location.detected': 'Shipping to',
    'location.shipping': 'Estimated shipping',
    
    // Product Manager
    'manager.title': 'Catalog Management',
    'manager.add': 'Add a product',
    'manager.reset': 'Reset',
    'manager.image': 'Image',
    'manager.name': 'Name',
    'manager.category': 'Category',
    'manager.price': 'Price',
    'manager.actions': 'Actions',
    
    // Product Form
    'form.addTitle': 'Add a product',
    'form.editTitle': 'Edit product',
    'form.productName': 'Product name',
    'form.productNamePlaceholder': 'Ex: Lagoon Tear',
    'form.category': 'Category',
    'form.price': 'Price',
    'form.image': 'Product image',
    'form.upload': 'Upload',
    'form.url': 'URL',
    'form.uploadHint': 'Click to select an image',
    'form.maxSize': 'Max 6MB',
    'form.description': 'Description',
    'form.descriptionPlaceholder': 'Jewelry description...',
    'form.cancel': 'Cancel',
    'form.save': 'Save',
    'form.add': 'Add',
    'form.imageRequired': 'Please add an image',
    'form.imageTypeError': 'Please select an image',
    'form.imageSizeError': 'Image too large (max 6MB)',
    'form.storageError': 'Browser storage full. Try a lighter image.',
    'form.genericError': 'Unable to add product. Please retry.',
    'form.added': 'Product added successfully',
    'form.updated': 'Product updated',
    'form.deleted': 'Product deleted',
    'form.resetConfirm': 'Reset catalog?',
    'form.resetDone': 'Catalog reset',
    'form.deleteConfirm': 'Delete this product?',
  },
};

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [countryCode, setCountryCode] = useState('PF');
  const [locale, setLocale] = useState<Locale>('fr');
  const [config, setConfig] = useState<LocaleConfig>(localeConfigs.default);

  // Detect country on mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const code = data.country_code || 'PF';
        setCountryCode(code);
        const cfg = localeConfigs[code] || localeConfigs.default;
        setConfig(cfg);
        setLocale(cfg.locale);
      } catch {
        // Keep defaults (Polynesia)
      }
    };
    detectCountry();
  }, []);

  // Update config when locale changes manually
  useEffect(() => {
    // Keep currency from detected country, only change language
    setConfig(prev => ({ ...prev, locale }));
  }, [locale]);

  const formatPrice = (priceXPF: number): string => {
    const converted = Math.round(priceXPF * config.exchangeRate);
    if (config.currency === 'XPF') {
      return `${converted.toLocaleString('fr-FR')} XPF`;
    }
    if (config.currency === 'EUR') {
      return `${converted.toLocaleString('fr-FR')} €`;
    }
    return `$${converted.toLocaleString('en-US')}`;
  };

  const t = (key: string): string => {
    return translations[locale][key] || key;
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        currency: config.currency,
        currencySymbol: config.currencySymbol,
        formatPrice,
        t,
        countryCode,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
