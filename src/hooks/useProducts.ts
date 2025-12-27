import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/oceane';
import { products as fallbackProducts } from '@/data/oceaneData';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Supabase
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('id, name, category, price, image, description')
        .eq('is_active', true)
        .order('id', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        // Convert price from numeric to number
        const formattedProducts: Product[] = data.map(p => ({
          ...p,
          price: Number(p.price)
        }));
        setProducts(formattedProducts);
      } else {
        // Fallback to initial products if table is empty
        console.warn('No products found in Supabase, using fallback data');
        setProducts(fallbackProducts);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      // Fallback to initial products on error
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Add a new product (admin only)
  const addProduct = async (product: Omit<Product, 'id'>): Promise<Product | null> => {
    try {
      const { data, error: insertError } = await supabase
        .from('products')
        .insert({
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          description: product.description,
          is_active: true,
          stock: 0,
        })
        .select('id, name, category, price, image, description')
        .single();

      if (insertError) {
        throw insertError;
      }

      if (data) {
        const newProduct: Product = {
          ...data,
          price: Number(data.price)
        };
        setProducts(prev => [...prev, newProduct]);
        return newProduct;
      }

      return null;
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err instanceof Error ? err.message : 'Failed to add product');
      return null;
    }
  };

  // Update an existing product (admin only)
  const updateProduct = async (id: number, updates: Partial<Product>): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          ...(updates.name && { name: updates.name }),
          ...(updates.category && { category: updates.category }),
          ...(updates.price !== undefined && { price: updates.price }),
          ...(updates.image && { image: updates.image }),
          ...(updates.description !== undefined && { description: updates.description }),
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, ...updates } : p))
      );

      return true;
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product');
      return false;
    }
  };

  // Delete a product (soft delete - sets is_active to false)
  const deleteProduct = async (id: number): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      setProducts(prev => prev.filter(p => p.id !== id));

      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      return false;
    }
  };

  // Refresh products from database
  const refreshProducts = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
  };
};
