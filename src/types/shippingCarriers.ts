export interface ShippingCarrier {
  id: string;
  name: string;
  logo: string;
  baseRates: {
    local: number;      // Polynésie
    pacific: number;    // Pacifique
    europe: number;     // Europe
    northamerica: number; // Amérique du Nord
    asia: number;       // Asie
    world: number;      // Reste du monde
  };
  deliveryDays: {
    local: string;
    pacific: string;
    europe: string;
    northamerica: string;
    asia: string;
    world: string;
  };
  freeShippingThreshold: number; // Montant en XPF pour livraison gratuite
}

// La Poste de Tahiti - uniquement pour Polynésie (îles hors Tahiti/Moorea)
export const laPosteTahiti: ShippingCarrier = {
  id: 'laposte-tahiti',
  name: 'La Poste de Tahiti',
  logo: '📮',
  baseRates: {
    local: 800, // Pour les îles hors Tahiti/Moorea
    pacific: 0,
    europe: 0,
    northamerica: 0,
    asia: 0,
    world: 0
  },
  deliveryDays: {
    local: '3-7',
    pacific: '',
    europe: '',
    northamerica: '',
    asia: '',
    world: ''
  },
  freeShippingThreshold: Infinity // Pas de gratuité
};

export const shippingCarriers: ShippingCarrier[] = [
  {
    id: 'colissimo',
    name: 'Colissimo',
    logo: '📦',
    baseRates: {
      local: 0, // Pas utilisé pour local (La Poste de Tahiti)
      pacific: 3500,
      europe: 2500,
      northamerica: 4000,
      asia: 3800,
      world: 5000
    },
    deliveryDays: {
      local: '',
      pacific: '7-10',
      europe: '5-7',
      northamerica: '7-10',
      asia: '7-12',
      world: '10-15'
    },
    freeShippingThreshold: Infinity // Pas de gratuité
  },
  {
    id: 'dhl',
    name: 'DHL Express',
    logo: '🚀',
    baseRates: {
      local: 0,
      pacific: 5000,
      europe: 4500,
      northamerica: 5500,
      asia: 5000,
      world: 7000
    },
    deliveryDays: {
      local: '',
      pacific: '3-5',
      europe: '2-4',
      northamerica: '3-5',
      asia: '3-5',
      world: '5-7'
    },
    freeShippingThreshold: Infinity
  },
  {
    id: 'fedex',
    name: 'FedEx',
    logo: '✈️',
    baseRates: {
      local: 0,
      pacific: 5500,
      europe: 5000,
      northamerica: 4800,
      asia: 5200,
      world: 7500
    },
    deliveryDays: {
      local: '',
      pacific: '3-5',
      europe: '3-5',
      northamerica: '2-4',
      asia: '3-5',
      world: '5-8'
    },
    freeShippingThreshold: Infinity
  },
  {
    id: 'ups',
    name: 'UPS',
    logo: '📬',
    baseRates: {
      local: 0,
      pacific: 5200,
      europe: 4800,
      northamerica: 4500,
      asia: 5000,
      world: 7200
    },
    deliveryDays: {
      local: '',
      pacific: '4-6',
      europe: '3-5',
      northamerica: '2-4',
      asia: '4-6',
      world: '6-9'
    },
    freeShippingThreshold: Infinity
  },
  {
    id: 'chronopost',
    name: 'Chronopost',
    logo: '⚡',
    baseRates: {
      local: 0,
      pacific: 4200,
      europe: 3500,
      northamerica: 5000,
      asia: 4500,
      world: 6000
    },
    deliveryDays: {
      local: '',
      pacific: '5-7',
      europe: '2-4',
      northamerica: '5-7',
      asia: '5-7',
      world: '7-10'
    },
    freeShippingThreshold: Infinity
  }
];

export type ShippingZoneKey = 'local' | 'pacific' | 'europe' | 'northamerica' | 'asia' | 'world';

export const countryToZone: Record<string, ShippingZoneKey> = {
  // Local - Polynésie Française
  PF: 'local',
  // Pacific
  NZ: 'pacific',
  AU: 'pacific',
  FJ: 'pacific',
  NC: 'pacific',
  // Europe
  FR: 'europe',
  DE: 'europe',
  IT: 'europe',
  ES: 'europe',
  BE: 'europe',
  CH: 'europe',
  NL: 'europe',
  GB: 'europe',
  PT: 'europe',
  AT: 'europe',
  IE: 'europe',
  GR: 'europe',
  FI: 'europe',
  SE: 'europe',
  DK: 'europe',
  NO: 'europe',
  PL: 'europe',
  CZ: 'europe',
  HU: 'europe',
  RO: 'europe',
  BG: 'europe',
  HR: 'europe',
  SK: 'europe',
  SI: 'europe',
  LU: 'europe',
  MC: 'europe',
  // North America
  US: 'northamerica',
  CA: 'northamerica',
  MX: 'northamerica',
  // Asia
  JP: 'asia',
  CN: 'asia',
  KR: 'asia',
  SG: 'asia',
  HK: 'asia',
  TW: 'asia',
};

export const getZoneFromCountry = (countryCode: string): ShippingZoneKey => {
  return countryToZone[countryCode] || 'world';
};

// City-based surcharges (in XPF) - remote/rural areas have higher fees
export const citySurcharges: Record<string, Record<string, number>> = {
  FR: {
    // Major French cities - no surcharge
    'paris': 0, 'lyon': 0, 'marseille': 0, 'toulouse': 0, 'nice': 0, 'nantes': 0, 'strasbourg': 0, 'bordeaux': 0, 'lille': 0, 'montpellier': 0,
    // Remote areas - small surcharge
    '_default': 300,
  },
  US: {
    // Major US cities - no surcharge
    'new york': 0, 'los angeles': 0, 'chicago': 0, 'houston': 0, 'phoenix': 0, 'san francisco': 0, 'miami': 0, 'seattle': 0, 'boston': 0, 'denver': 0,
    // Alaska, Hawaii - higher surcharge
    'anchorage': 1500, 'honolulu': 1200,
    '_default': 400,
  },
  DE: {
    'berlin': 0, 'munich': 0, 'hamburg': 0, 'frankfurt': 0, 'cologne': 0, 'düsseldorf': 0, 'stuttgart': 0,
    '_default': 250,
  },
  JP: {
    'tokyo': 0, 'osaka': 0, 'kyoto': 0, 'yokohama': 0, 'nagoya': 0, 'sapporo': 0, 'kobe': 0, 'fukuoka': 0,
    '_default': 400,
  },
  AU: {
    'sydney': 0, 'melbourne': 0, 'brisbane': 0, 'perth': 0, 'adelaide': 0,
    '_default': 600,
  },
  CA: {
    'toronto': 0, 'montreal': 0, 'vancouver': 0, 'calgary': 0, 'ottawa': 0,
    '_default': 500,
  },
  PF: {
    // Tahiti et Moorea - pas de frais de shipping
    'papeete': 0, 'faaa': 0, 'punaauia': 0, 'pirae': 0, 'arue': 0, 'mahina': 0, 'paea': 0, 'papara': 0, 'taravao': 0, 'tiarei': 0,
    'moorea': 0, 'temae': 0, 'haapiti': 0, 'afareaitu': 0, 'paopao': 0,
    // Autres îles - frais via La Poste de Tahiti
    '_default': 0, // Le surcharge est géré séparément
  },
};

// Villes de Tahiti et Moorea (livraison gratuite locale)
export const tahitiMooreaChilies = [
  'papeete', 'faaa', 'punaauia', 'pirae', 'arue', 'mahina', 'paea', 'papara', 'taravao', 'tiarei',
  'moorea', 'temae', 'haapiti', 'afareaitu', 'paopao'
];

export const isTahitiOrMoorea = (city: string): boolean => {
  return tahitiMooreaChilies.includes(city.toLowerCase().trim());
};

export const getCitySurcharge = (countryCode: string, city: string): number => {
  const countrySurcharges = citySurcharges[countryCode];
  if (!countrySurcharges) return 0;
  
  const normalizedCity = city.toLowerCase().trim();
  const surcharge = countrySurcharges[normalizedCity];
  
  if (surcharge !== undefined) return surcharge;
  return countrySurcharges['_default'] || 0;
};

export const calculateCarrierShippingCost = (
  carrier: ShippingCarrier,
  zone: ShippingZoneKey,
  orderTotal: number,
  countryCode?: string,
  city?: string
): { cost: number; isFree: boolean } => {
  let baseCost = carrier.baseRates[zone];
  
  // Add city surcharge if applicable
  if (countryCode && city) {
    baseCost += getCitySurcharge(countryCode, city);
  }
  
  return { cost: baseCost, isFree: false };
};

// Pour la Polynésie, obtenir les transporteurs disponibles
export const getAvailableCarriers = (countryCode: string, city: string): ShippingCarrier[] => {
  if (countryCode === 'PF') {
    // Tahiti et Moorea: pas de frais de shipping
    if (isTahitiOrMoorea(city)) {
      return []; // Livraison incluse
    }
    // Autres îles: uniquement La Poste de Tahiti
    return [laPosteTahiti];
  }
  // Autres pays: tous les transporteurs internationaux
  return shippingCarriers;
};
