import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  text: string;
  location: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials = ({ testimonials }: TestimonialsProps) => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-6 text-center">
      <Star className="w-6 h-6 text-sand-gold mx-auto mb-4 fill-sand-gold" />
      <h2 className="font-serif text-3xl mb-12 text-foreground">Ce que disent nos clients</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map(t => (
          <div key={t.id} className="bg-card p-8 shadow-sm">
            <p className="text-muted-foreground italic mb-6 font-serif text-lg">"{t.text}"</p>
            <p className="font-bold text-sm uppercase tracking-wide text-foreground">{t.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.location}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
