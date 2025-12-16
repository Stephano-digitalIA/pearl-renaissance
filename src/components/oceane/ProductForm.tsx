import { useState, useRef, useEffect } from 'react';
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
import { useLocale } from '@/contexts/LocaleContext';

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  initialData?: Product;
}

const productCategories = categories.filter(c => c !== 'Tous');

export const ProductForm = ({ open, onClose, onSubmit, initialData }: ProductFormProps) => {
  const { t } = useLocale();
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

  // Reset form when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      setFormData({
        name: initialData?.name || '',
        category: initialData?.category || productCategories[0],
        price: initialData?.price?.toString() || '',
        image: initialData?.image || '',
        description: initialData?.description || '',
      });
      setImagePreview(initialData?.image || '');
      setImageMode('upload');
    }
  }, [open, initialData]);

  const compressImageToDataUrl = async (file: File) => {
    const TARGET_BYTES = 450 * 1024;
    const MAX_DIM = 1600;

    const objectUrl = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.decoding = 'async';
      img.src = objectUrl;
      await img.decode();

      const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
      let w = Math.max(1, Math.round(img.width * scale));
      let h = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unsupported');

      let quality = 0.86;
      for (let pass = 0; pass < 10; pass++) {
        canvas.width = w;
        canvas.height = h;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64 = dataUrl.split(',')[1] || '';
        const approxBytes = Math.floor((base64.length * 3) / 4);

        if (approxBytes <= TARGET_BYTES) return dataUrl;

        if (quality > 0.55) {
          quality = Math.max(0.55, quality - 0.08);
        } else {
          w = Math.max(1, Math.round(w * 0.85));
          h = Math.max(1, Math.round(h * 0.85));
        }
      }

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      return canvas.toDataURL('image/jpeg', Math.max(0.55, quality));
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(t('form.imageTypeError'));
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      toast.error(t('form.imageSizeError'));
      return;
    }

    try {
      const optimized = await compressImageToDataUrl(file);
      setFormData((prev) => ({ ...prev, image: optimized }));
      setImagePreview(optimized);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData((prev) => ({ ...prev, image: base64 }));
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error(t('form.imageRequired'));
      return;
    }

    try {
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
    } catch (err: any) {
      const message = String(err?.message || err);
      const isQuota =
        err?.name === 'QuotaExceededError' ||
        /quota/i.test(message) ||
        /exceeded/i.test(message) ||
        /localstorage/i.test(message);

      toast.error(isQuota ? t('form.storageError') : t('form.genericError'));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {initialData ? t('form.editTitle') : t('form.addTitle')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('form.productName')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t('form.productNamePlaceholder')}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t('form.category')}</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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
            <Label htmlFor="price">{t('form.price')} (XPF)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="1"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="1250"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t('form.image')}</Label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant={imageMode === 'upload' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setImageMode('upload')}
              >
                <Upload className="h-4 w-4 mr-1" />
                {t('form.upload')}
              </Button>
              <Button
                type="button"
                variant={imageMode === 'url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setImageMode('url')}
              >
                <Link className="h-4 w-4 mr-1" />
                {t('form.url')}
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
                  {t('form.uploadHint')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{t('form.maxSize')}</p>
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
            <Label htmlFor="description">{t('form.description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('form.descriptionPlaceholder')}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('form.cancel')}
            </Button>
            <Button type="submit">
              {initialData ? t('form.save') : t('form.add')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
