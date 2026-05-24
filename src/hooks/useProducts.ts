import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import type { Product } from '../types/product.types';

export default function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, isLoading, error };
}