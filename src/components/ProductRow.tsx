import { useTranslation } from "react-i18next";
import PriceTag from "@/components/PriceTag";
import QuantitySelector from "@/components/QuantitySelector";
import type { Product } from "@/types/product.types";
import { calculateDiscountedPrice } from "@/utils/calculateDiscountedPrice";

interface ProductRowProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  onClickProduct?: () => void;
}

export default function ProductRow({
  product,
  quantity,
  onQuantityChange,
  onRemove,
  onClickProduct,
}: ProductRowProps) {
  const { t } = useTranslation();

  return (
    <article className="flex flex-col gap-4 rounded-md border border-muted-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={onClickProduct}
        className="flex flex-1 cursor-pointer items-center gap-4 text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <img
          src={product.thumbnail}
          alt={t("components.productRow.imageAlt", { title: product.title })}
          className="h-20 w-20 rounded-md bg-muted-50 object-contain p-2"
        />

        <div className="min-w-0">
          <h2 className="line-clamp-2 text-base font-semibold text-muted-950">
            {product.title}
          </h2>
          <p className="mt-1 text-sm text-muted-700">
            {t("components.productRow.stock", { count: product.stock })}
          </p>
          <div className="mt-2">
            <PriceTag
              originalPrice={product.price}
              discountedPrice={calculateDiscountedPrice(
                product.price,
                product.discountPercentage,
              )}
            />
          </div>
        </div>
      </button>

      <div className="flex justify-end sm:w-auto">
        <QuantitySelector
          value={quantity}
          min={1}
          max={product.stock}
          onChange={onQuantityChange}
          onRemove={onRemove}
        />
      </div>
    </article>
  );
}
