import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductCard from "@/components/ProductCard";
import { getProductById } from "@/services/productService";
import type { Product } from "@/types/product.types";

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);
  const isInvalidProductId = !Number.isFinite(productId);
  const [state, setState] = useState<{
    product: Product | null;
    error: boolean;
    productId: number | null;
  }>({
    product: null,
    error: false,
    productId: null,
  });

  useEffect(() => {
    if (isInvalidProductId) {
      return;
    }

    getProductById(productId)
      .then((data) =>
        setState({
          product: data,
          error: false,
          productId,
        }),
      )
      .catch(() =>
        setState({
          product: null,
          error: true,
          productId,
        }),
      );
  }, [isInvalidProductId, productId]);

  if (isInvalidProductId || (state.error && state.productId === productId)) {
    return <main className="p-6">Produto nao encontrado.</main>;
  }

  if (state.productId !== productId || !state.product) {
    return <main className="p-6">Carregando produto...</main>;
  }

  return (
    <main className="mx-auto max-w-sm p-6">
      <ProductCard product={state.product} />
    </main>
  );
}
