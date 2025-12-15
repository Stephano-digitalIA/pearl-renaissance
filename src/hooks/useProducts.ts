import { useState, useEffect } from 'react';
import { Product } from '@/types/oceane';
import { products as initialProducts } from '@/data/oceaneData';

const STORAGE_KEY = 'oceane_products';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(initialProducts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
    }
    setLoading(false);
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct = { ...product, id: newId };
    saveProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    const newProducts = products.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    saveProducts(newProducts);
  };

  const deleteProduct = (id: number) => {
    saveProducts(products.filter(p => p.id !== id));
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
