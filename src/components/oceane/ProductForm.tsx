import { useState, useRef } from 'react';
import { Product } from '@/types/oceane';
import { categories } from '@/data/oceaneData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Upload, Link, X } from 'lucide-react';
import { toast } from 'sonner';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  initialData?: Product;
}

const productCategories = categories.filter(c => c !== 'Tous');

export const ProductForm = ({ open, onClose, onSubmit, initialData }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || productCategories[0],
    price: initialData?.price?.toString() || '',
    image: initialData?.image || '',
    description: initialData?.description || '',
  });
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Validate file size (max 6MB for localStorage)
    if (file.size > 6 * 1024 * 1024) {
      toast.error('Image trop grande (max 6MB)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFormData({ ...formData, image: base64 });
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url: string) => {
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const clearImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Veuillez ajouter une image');
      return;
    }
    onSubmit({
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      image: formData.image.trim(),
      description: formData.description.trim(),
    });
    onClose();
    setFormData({
      name: '',
      category: productCategories[0],
      price: '',
      image: '',
      description: '',
    });
    setImagePreview('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {initialData ? 'Modifier le produit' : 'Ajouter un produit'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du produit</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Larme du Lagon"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {productCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Prix (XPF)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="1"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="1250"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Image du produit</Label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant={imageMode === 'upload' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setImageMode('upload')}
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
              <Button
                type="button"
                variant={imageMode === 'url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setImageMode('url')}
              >
                <Link className="h-4 w-4 mr-1" />
                URL
              </Button>
            </div>

            {imageMode === 'upload' ? (
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Cliquez pour sélectionner une image
                </p>
                <p className="text-xs text-muted-foreground mt-1">Max 6MB</p>
              </div>
            ) : (
              <Input
                type="url"
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://..."
              />
            )}

            {imagePreview && (
              <div className="relative mt-2">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={() => setImagePreview('')}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description du bijou..."
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {initialData ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
