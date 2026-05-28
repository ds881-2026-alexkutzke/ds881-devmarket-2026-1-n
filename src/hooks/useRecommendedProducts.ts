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

interface RecommendedProductsState {
  products: Product[];
  error: boolean;
  requestKey: string | null;
}

export function useRecommendedProducts({
  excludeIds = [],
}: UseRecommendedProductsOptions = {}): UseRecommendedProductsResult {
  const excludeKey = excludeIds.join(",");
  const [state, setState] = useState<RecommendedProductsState>({
    products: [],
    error: false,
    requestKey: null,
  });

  useEffect(() => {
    let isActive = true;
    const ids = excludeKey
      ? excludeKey.split(",").map((id) => Number(id))
      : [];

    getRecommendedProducts(ids)
      .then((data) => {
        if (isActive) {
          setState({
            products: data,
            error: false,
            requestKey: excludeKey,
          });
        }
      })
      .catch(() => {
        if (isActive) {
          setState({
            products: [],
            error: true,
            requestKey: excludeKey,
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [excludeKey]);

  return {
    products: state.products,
    loading: state.requestKey !== excludeKey,
    error: state.error,
  };
}
