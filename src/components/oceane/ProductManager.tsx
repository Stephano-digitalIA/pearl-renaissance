import { useState } from 'react';
import { ProductForm } from './ProductForm';
import { Product } from '@/types/oceane';
import { Button } from '@/components/ui/button';
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
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';

interface ProductManagerProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  resetProductsStorage: () => void;
}

export const ProductManager = ({
  open,
  onClose,
  products,
  addProduct,
  updateProduct,
  deleteProduct,
  resetProductsStorage,
}: ProductManagerProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const handleAdd = (product: Omit<Product, 'id'>) => {
    addProduct(product);
    toast.success('Produit ajouté avec succès');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleUpdate = (product: Omit<Product, 'id'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, product);
      toast.success('Produit modifié');
      setEditingProduct(undefined);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Supprimer ce produit ?')) {
      deleteProduct(id);
      toast.success('Produit supprimé');
    }
  };

  const handleResetStorage = () => {
    if (
      confirm(
        'Réinitialiser le catalogue ? Cela supprime les produits ajoutés localement et libère de la place de stockage.'
      )
    ) {
      resetProductsStorage();
      toast.success('Catalogue réinitialisé');
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingProduct(undefined);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) onClose();
        }}
      >
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden bg-background">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl flex items-center gap-2">
              <Package className="h-5 w-5" />
              Gestion du Catalogue
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center justify-end gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={handleResetStorage}>
              Réinitialiser
            </Button>
            <Button onClick={() => setFormOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          </div>

          <div className="overflow-auto max-h-[50vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Prix</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">
                      {product.price.toLocaleString()} XPF
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <ProductForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={editingProduct ? handleUpdate : handleAdd}
        initialData={editingProduct}
      />
    </>
  );
};
