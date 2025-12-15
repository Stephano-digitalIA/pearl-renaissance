import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => (
  <footer className="bg-ocean-dark text-primary-foreground pt-20 pb-10">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12 mb-12">
      <div className="col-span-1 md:col-span-1">
        <div className="text-3xl font-serif font-bold tracking-widest mb-6">OCÉANE</div>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          L'essence pure de la Polynésie. Des bijoux créés avec passion, authenticité et respect de la nature.
        </p>
        <div className="flex space-x-4">
          <Instagram className="w-5 h-5 text-gray-400 hover:text-primary-foreground cursor-pointer transition-colors" />
          <Facebook className="w-5 h-5 text-gray-400 hover:text-primary-foreground cursor-pointer transition-colors" />
          <Twitter className="w-5 h-5 text-gray-400 hover:text-primary-foreground cursor-pointer transition-colors" />
        </div>
      </div>
      
      <div>
        <h4 className="font-serif text-lg mb-6">Collections</h4>
        <ul className="space-y-3 text-sm text-gray-400">
          <li><a href="#" className="hover:text-sand-gold transition-colors">Colliers</a></li>
          <li><a href="#" className="hover:text-sand-gold transition-colors">Bagues</a></li>
          <li><a href="#" className="hover:text-sand-gold transition-colors">Boucles d'oreilles</a></li>
          <li><a href="#" className="hover:text-sand-gold transition-colors">Haute Joaillerie</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-serif text-lg mb-6">Client</h4>
        <ul className="space-y-3 text-sm text-gray-400">
          <li><a href="#" className="hover:text-sand-gold transition-colors">Contact</a></li>
          <li><a href="#" className="hover:text-sand-gold transition-colors">Livraison & Retours</a></li>
          <li><a href="#" className="hover:text-sand-gold transition-colors">Entretien des Perles</a></li>
          <li><a href="#" className="hover:text-sand-gold transition-colors">FAQ</a></li>
        </ul>
      </div>

      <div>
        <h4 className="font-serif text-lg mb-6">Newsletter</h4>
        <p className="text-gray-400 text-sm mb-4">Recevez nos offres exclusives et nos conseils d'entretien.</p>
        <div className="flex border-b border-gray-600 pb-2">
          <input 
            type="email" 
            placeholder="Votre email" 
            className="bg-transparent w-full outline-none text-primary-foreground placeholder-gray-500 text-sm" 
          />
          <button className="text-sand-gold hover:text-primary-foreground uppercase text-xs font-bold tracking-widest">
            S'inscrire
          </button>
        </div>
      </div>
    </div>
    <div className="text-center text-gray-600 text-xs">
      &copy; 2024 Océane Perles. Tous droits réservés. Design Concept.
    </div>
  </footer>
);

export default Footer;
