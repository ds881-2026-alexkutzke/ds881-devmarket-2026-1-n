import type { Product, ProductResponse } from '@/types/product.types';
import { apiFetch } from './apiService';

let productsCache: Product[] | null = null;
// Promise em andamento para evitar fetchs duplicados (request deduping)
let productsPromise: Promise<Product[]> | null = null;

export async function getProducts(): Promise<Product[]> {
  if (productsCache) return productsCache;

  if (productsPromise) return productsPromise;

  productsPromise = apiFetch<ProductResponse>('/products')
    .then((res) => {
      productsCache = res.products;
      return productsCache as Product[];
    })
    .finally(() => {
      productsPromise = null;
    });

  return productsPromise;
}

export async function getProductsById(id: number): Promise<Product> {
  if (productsCache) {
    const found = productsCache.find((p) => p.id === id);
    if (found) return found;
  }

  const product = await apiFetch<Product>(`/products/${id}`);
  return product;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  if (!productsCache) {
    await getProducts();
  }

  if (!productsCache) return [];

  return productsCache.filter((p) =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q)
  );
}

export async function getFirstProduct(): Promise<Product> {
  const products = await getProducts();
  if (!products || products.length === 0) {
    throw new Error('No products available');
  }
  return products[0];
}
