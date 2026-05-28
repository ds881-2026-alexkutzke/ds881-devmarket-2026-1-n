import { useEffect, useState } from "react";

import { getRecommendedProducts } from "@/services/productService";
import type { Product } from "@/types/product.types";

interface UseRecommendedProductsOptions {
  excludeIds?: number[];
}

interface UseRecommendedProductsResult {
  products: Product[];
  loading: boolean;
  error: boolean;
}

export function useRecommendedProducts({
  excludeIds = [],
}: UseRecommendedProductsOptions = {}): UseRecommendedProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const excludeKey = excludeIds.join(",");

  useEffect(() => {
    let isActive = true;

    setLoading(true);
    setError(false);

    getRecommendedProducts(excludeIds)
      .then((data) => {
        if (isActive) {
          setProducts(data);
        }
      })
      .catch(() => {
        if (isActive) {
          setProducts([]);
          setError(true);
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [excludeKey]);

  return { products, loading, error };
}
