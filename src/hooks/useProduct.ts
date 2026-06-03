import { useEffect, useState } from "react";
import type { Product } from "@/types/product.types";
import { getProductsById } from "@/services/productService";

export const useProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const [loading, setLoading] = useState<boolean>(!!id);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const numericId = Number(id);

        if (isNaN(numericId)) {
          throw new Error("ID do produto inválido");
        }

        const data = await getProductsById(numericId);

        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("An unknown error occurred"),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { product, loading, error };
};
