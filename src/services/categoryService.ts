import { apiFetch } from '@/services/apiService';
import type { Category } from '@/types/category.types';
import type { Product } from '@/types/product.types';

// Cache em variável de módulo
let categoriesCache: Category[] | null = null;

export async function getCategories(): Promise<Category[]> {
  if (categoriesCache) return categoriesCache;

  try {
    const data = await apiFetch<Category[]>('/products/categories');
    categoriesCache = data;
    return data;
  } catch (error) {
    
    throw error;
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    return await apiFetch<Product[]>(`/products/category/${category}`);
  } catch (error) {
   
    throw error;
  }
}

// Para manter compatibilidade
export const categoryService = {
  getAll: getCategories,
  getByCategory: getProductsByCategory
};