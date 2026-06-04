import type { Product } from "@/types/product.types";
import Carousel from "./Carousel";
import ProductCard from "./ProductCard";

interface ProductCarouselProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

const ProductCarousel = ({ products, onProductClick }: ProductCarouselProps) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <Carousel>
      {products.map((product) => (
        <div key={product.id} className="h-full w-64 shrink-0 sm:w-72">
          <ProductCard
            product={product}
            onClick={() => onProductClick?.(product)}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;