import { useMemo } from 'react';
import useProducts from '@/hooks/useProducts';
import useTopCategories from '@/hooks/useTopCategories';
import { topNByDiscount } from '@/utils/topNByDiscount';
import type { Product } from '@/types/product.types';

const TOP_CATEGORIES_COUNT = 3;
const MAX_RECOMMENDED = 10;

export default function useRecommendedProducts(excludeIds: number[] = []) {
  const { products, isLoading, error } = useProducts();
  const { categories: topCategories } = useTopCategories(TOP_CATEGORIES_COUNT);

  const excludeKey = excludeIds.join(',');

  const recommended = useMemo<Product[]>(() => {
    if (products.length === 0 || topCategories.length === 0) return [];

    const excludeSet = new Set(excludeIds);

    const candidates = products.filter(
      (p) => topCategories.includes(p.category) && !excludeSet.has(p.id),
    );

    return topNByDiscount(candidates, MAX_RECOMMENDED);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, topCategories, excludeKey]);

  return { products: recommended, isLoading, error };
}
