import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/oceane/Navbar';
import Footer from '@/components/oceane/Footer';
import { ProductManager } from '@/components/oceane/ProductManager';
import { ShippingManager } from '@/components/oceane/ShippingManager';
import { useProducts } from '@/hooks/useProducts';
import { useShippingZones } from '@/hooks/useShippingZones';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Truck, Settings, Plus, Pencil, Trash2, LogOut, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLocale } from '@/contexts/LocaleContext';
import { ProductForm } from '@/components/oceane/ProductForm';
import { Product } from '@/types/oceane';
import { toast } from 'sonner';

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetProductsStorage } = useProducts();
  const { zones, updateZone, resetZones } = useShippingZones();
  const { t, formatPrice } = useLocale();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const handleAdd = (product: Omit<Product, 'id'>) => {
    addProduct(product);
    toast.success(t('form.added'));
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleUpdate = (product: Omit<Product, 'id'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, product);
      toast.success(t('form.updated'));
      setEditingProduct(undefined);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm(t('form.deleteConfirm'))) {
      deleteProduct(id);
      toast.success(t('form.deleted'));
    }
  };

  const handleResetProducts = () => {
    if (confirm(t('form.resetConfirm'))) {
      resetProductsStorage();
      toast.success(t('form.resetDone'));
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    toast.success('Déconnexion réussie');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={0} setIsCartOpen={() => {}} />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="font-serif text-3xl font-bold">Administration</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Catalogue
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Transport
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {t('manager.title')}
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleResetProducts}>
                    {t('manager.reset')}
                  </Button>
                  <Button onClick={() => setFormOpen(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('manager.add')}
                  </Button>
                </div>
              </div>

              <div className="overflow-auto max-h-[60vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">{t('manager.image')}</TableHead>
                      <TableHead>{t('manager.name')}</TableHead>
                      <TableHead>{t('manager.category')}</TableHead>
                      <TableHead className="text-right">{t('manager.price')}</TableHead>
                      <TableHead className="w-[100px]">{t('manager.actions')}</TableHead>
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
                          {formatPrice(product.price)}
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
            </div>
          </TabsContent>

          <TabsContent value="shipping">
            <div className="bg-card rounded-lg border p-6">
              <ShippingManager
                zones={zones}
                updateZone={updateZone}
                resetZones={resetZones}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      <ProductForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={editingProduct ? handleUpdate : handleAdd}
        initialData={editingProduct}
      />
    </div>
  );
};

export default Admin;
