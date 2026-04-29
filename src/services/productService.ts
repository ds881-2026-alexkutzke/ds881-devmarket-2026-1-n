import type { Product } from '../types/product.types.ts';

export const getFirstProduct = async (): Promise<Product> => {
  const response = await fetch('https://dummyjson.com/products/1');
  if (!response.ok) {
    throw new Error('Falha ao buscar produto');
  }
  return response.json();
};
