import { useState } from 'react';
import { ShippingZone } from '@/types/geolocation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Truck, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useLocale } from '@/contexts/LocaleContext';

interface ShippingManagerProps {
  zones: ShippingZone[];
  updateZone: (id: string, updates: Partial<ShippingZone>) => void;
  resetZones: () => void;
}

export const ShippingManager = ({
  zones,
  updateZone,
  resetZones,
}: ShippingManagerProps) => {
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [formData, setFormData] = useState({
    baseCost: 0,
    perKgCost: 0,
    estimatedDays: '',
  });
  const { t, formatPrice } = useLocale();

  const handleEdit = (zone: ShippingZone) => {
    setEditingZone(zone);
    setFormData({
      baseCost: zone.baseCost,
      perKgCost: zone.perKgCost,
      estimatedDays: zone.estimatedDays,
    });
  };

  const handleSave = () => {
    if (editingZone) {
      updateZone(editingZone.id, {
        baseCost: formData.baseCost,
        perKgCost: formData.perKgCost,
        estimatedDays: formData.estimatedDays,
      });
      toast.success('Zone de livraison mise à jour');
      setEditingZone(null);
    }
  };

  const handleReset = () => {
    if (confirm('Réinitialiser tous les frais de livraison ?')) {
      resetZones();
      toast.success('Frais de livraison réinitialisés');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Frais de Transport
        </h3>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zone</TableHead>
              <TableHead>Pays inclus</TableHead>
              <TableHead className="text-right">Frais de base</TableHead>
              <TableHead className="text-right">Par kg</TableHead>
              <TableHead>Délai</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.map((zone) => (
              <TableRow key={zone.id}>
                <TableCell className="font-medium">{zone.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {zone.countries.length > 0 ? zone.countries.slice(0, 5).join(', ') + (zone.countries.length > 5 ? '...' : '') : 'Autres pays'}
                </TableCell>
                <TableCell className="text-right">
                  {zone.baseCost === 0 ? 'Gratuit' : formatPrice(zone.baseCost)}
                </TableCell>
                <TableCell className="text-right">
                  {zone.perKgCost === 0 ? '-' : formatPrice(zone.perKgCost)}
                </TableCell>
                <TableCell>{zone.estimatedDays}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(zone)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingZone} onOpenChange={(open) => !open && setEditingZone(null)}>
        <DialogContent className="sm:max-w-[400px] bg-background">
          <DialogHeader>
            <DialogTitle className="font-serif">
              Modifier: {editingZone?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="baseCost">Frais de base (XPF)</Label>
              <Input
                id="baseCost"
                type="number"
                min="0"
                value={formData.baseCost}
                onChange={(e) => setFormData({ ...formData, baseCost: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perKgCost">Frais par kg (XPF)</Label>
              <Input
                id="perKgCost"
                type="number"
                min="0"
                value={formData.perKgCost}
                onChange={(e) => setFormData({ ...formData, perKgCost: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDays">Délai estimé</Label>
              <Input
                id="estimatedDays"
                value={formData.estimatedDays}
                onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
                placeholder="Ex: 5-7 jours"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingZone(null)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
