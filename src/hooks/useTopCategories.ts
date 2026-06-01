import { useMemo } from 'react';
import useProducts from '@/hooks/useProducts';
import { topNByFrequency } from '@/utils/topNByFrequency';
import type { Product } from '@/types/product.types';

export default function useTopCategories(n: number) {
  const { products, isLoading, error } = useProducts();

  const categories = useMemo<Product['category'][]>(() => {
    if (products.length === 0) return [];
    return topNByFrequency(
      products.map((p) => p.category),
      n,
    );
  }, [products, n]);

  return { categories, isLoading, error };
}
