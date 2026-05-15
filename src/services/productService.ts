import type { Product } from '../types/product.types.ts';
import { httpGet } from './httpService';

export const getFirstProduct = async (): Promise<Product> => {
  return httpGet('/products/1');
};