const NewsletterCTA = () => (
  <section 
    className="py-24 bg-cover bg-center relative flex items-center justify-center" 
    style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1516021868350-04dc326d91d8?q=80&w=2074&auto=format&fit=crop")'
    }}
  >
    <div className="absolute inset-0 bg-ocean-dark/60"></div>
    <div className="relative z-10 text-center text-primary-foreground px-6">
      <h2 className="font-serif text-4xl mb-4">L'exclusivité à votre portée</h2>
      <p className="mb-8 font-light max-w-lg mx-auto">
        Rejoignez notre cercle privé et accédez à nos ventes privées de perles rares.
      </p>
      <button className="border-2 border-primary-foreground px-8 py-3 uppercase tracking-widest hover:bg-primary-foreground hover:text-ocean-dark transition-all duration-300">
        Devenir Membre
      </button>
    </div>
  </section>
);

export default NewsletterCTA;
