import { Product, Testimonial } from '@/types/oceane';

export const products: Product[] = [
  { 
    id: 1, 
    name: "Larme du Lagon", 
    category: "Colliers", 
    price: 1250, 
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800", 
    description: "Pendentif perle de Tahiti solitaire, 10mm, montée sur or blanc 18k." 
  },
  { 
    id: 2, 
    name: "Nuit Étoilée", 
    category: "Boucles d'oreilles", 
    price: 890, 
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800", 
    description: "Paire de perles baroques aux reflets aubergine, crochets or jaune." 
  },
  { 
    id: 3, 
    name: "Atoll Royal", 
    category: "Bracelets", 
    price: 2100, 
    image: "https://images.unsplash.com/photo-1602752250055-567f4a72758c?auto=format&fit=crop&q=80&w=800", 
    description: "Bracelet cuir et perles multiples, fermoir en argent massif." 
  },
  { 
    id: 4, 
    name: "Profondeur Océan", 
    category: "Bagues", 
    price: 1540, 
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800", 
    description: "Perle noire parfaite de 11mm sur anneau pavé de diamants." 
  },
  { 
    id: 5, 
    name: "Souffle de Moorea", 
    category: "Colliers", 
    price: 3400, 
    image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=800", 
    description: "Rang de perles multicolores (gris, vert, paon), fermoir invisible." 
  },
  { 
    id: 6, 
    name: "Éclat Solaire", 
    category: "Boucles d'oreilles", 
    price: 650, 
    image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&q=80&w=800", 
    description: "Perles Keshi dorées, design minimaliste et moderne." 
  },
];

export const testimonials: Testimonial[] = [
  { 
    id: 1, 
    name: "Sophie M.", 
    text: "Une qualité exceptionnelle. La perle a un lustre incroyable, bien plus beau qu'en photo.", 
    location: "Paris" 
  },
  { 
    id: 2, 
    name: "Marc D.", 
    text: "Le cadeau parfait pour notre anniversaire de mariage. L'emballage était aussi luxueux que le bijou.", 
    location: "Lyon" 
  },
  { 
    id: 3, 
    name: "Elena R.", 
    text: "J'ai ressenti l'âme de la Polynésie en ouvrant la boîte. Magnifique.", 
    location: "Bordeaux" 
  }
];

export const categories = ['Tous', "Colliers", "Boucles d'oreilles", "Bracelets", "Bagues"];
