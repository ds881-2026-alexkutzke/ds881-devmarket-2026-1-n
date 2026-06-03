import type { Product } from "@/types/product.types";
import { useTranslation } from "react-i18next";
import DiscountBadge from "./DiscountBadge";
import StarRating from "./StarRating";
import PriceTag from "./PriceTag";
import { calculateDiscountedPrice } from "@/utils/calculateDiscountedPrice";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { t } = useTranslation();

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-muted-300 bg-white transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      {/* Container da Imagem com o Badge */}
      <div className="relative flex aspect-square w-full items-center justify-center bg-muted-50 p-4">
        <div className="absolute left-2 top-2 z-10">
          <DiscountBadge percentage={product.discountPercentage} />
        </div>
        <img
          src={product.thumbnail}
          alt={t("components.productCard.imageAlt", { title: product.title })}
          className="h-full w-full object-contain"
        />
      </div>

      {/* Conteúdo do Card (Título, Rating e Preço) */}
      <div className="flex flex-grow flex-col gap-2 p-4">
        <h3
          title={product.title}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-muted-950"
        >
          {product.title}
        </h3>

        <StarRating rating={product.rating} />
        <PriceTag
          originalPrice={product.price}
          discountedPrice={calculateDiscountedPrice(
            product.price,
            product.discountPercentage,
          )}
        />
      </div>
    </div>
  );
}
