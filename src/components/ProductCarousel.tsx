import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product.types";

interface ProductCarouselProps {
  products: Product[];
  title: string;
  loading?: boolean;
  error?: boolean;
  onProductClick?: (product: Product) => void;
}

export default function ProductCarousel({
  products,
  title,
  loading = false,
  error = false,
  onProductClick,
}: ProductCarouselProps) {
  if (loading) {
    return (
      <section className="mt-8 px-4 text-left" aria-live="polite">
        <h2>{title}</h2>
        <p className="text-sm text-muted-500">Carregando recomendacoes...</p>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 px-4 text-left" aria-label={title}>
      <h2>{title}</h2>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-4">
        {products.map((product) => (
          <div key={product.id} className="w-56 shrink-0">
            <ProductCard
              product={product}
              onClick={() => onProductClick?.(product)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
