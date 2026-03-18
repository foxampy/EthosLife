/**
 * Products Store - Product Catalog Management
 * Manages products, categories, and search
 */

import { create } from 'zustand';
import api from '../services/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  rating?: number;
  reviews_count?: number;
  inStock: boolean;
}

interface ProductsStore {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;

  fetchProducts: (filters?: { category?: string; search?: string }) => Promise<void>;
  fetchCategories: () => Promise<void>;
  searchProducts: (query: string) => Product[];
  getProductById: (id: string) => Product | undefined;
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchProducts: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams(filters as any);
      const response = await api.get(`/products?${params}`);
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch products', isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await api.get('/products/categories');
      set({ categories: response.data });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  searchProducts: (query) => {
    const { products } = get();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );
  },

  getProductById: (id) => {
    return get().products.find((p) => p.id === id);
  },
}));

export default useProductsStore;
