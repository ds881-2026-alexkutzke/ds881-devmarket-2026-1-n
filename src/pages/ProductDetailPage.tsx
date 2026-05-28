import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ProductCard from "@/components/ProductCard";
import { getProductById } from "@/services/productService";
import type { Product } from "@/types/product.types";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const productId = Number(id);

    if (!Number.isFinite(productId)) {
      setError(true);
      return;
    }

    getProductById(productId)
      .then((data) => setProduct(data))
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return <main className="p-6">Produto nao encontrado.</main>;
  }

  if (!product) {
    return <main className="p-6">Carregando produto...</main>;
  }

  return (
    <main className="mx-auto max-w-sm p-6">
      <ProductCard product={product} />
    </main>
  );
}
