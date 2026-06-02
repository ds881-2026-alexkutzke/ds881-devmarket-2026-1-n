import { formatCurrency } from "@/utils/formatCurrency";

interface PriceTagProps {
  originalPrice: number;
  discountedPrice: number;
}

export default function PriceTag({
  originalPrice,
  discountedPrice,
}: PriceTagProps) {
  const hasDiscount = discountedPrice < originalPrice;

  if (!hasDiscount) {
    return (
      <div className="font-bold text-primary-600">
        {formatCurrency(discountedPrice)}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="line-through text-danger-700">
        {formatCurrency(originalPrice)}
      </span>

      <span className="font-bold text-success-700">
        {formatCurrency(discountedPrice)}
      </span>
    </div>
  );
}