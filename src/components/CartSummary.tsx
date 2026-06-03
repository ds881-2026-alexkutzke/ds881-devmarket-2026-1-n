import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import PriceTag from "@/components/PriceTag";
import { formatCurrency } from "@/utils/formatCurrency";

interface CartSummaryProps {
  itemCount: number;
  totalWithoutDiscount: number;
  totalDiscount: number;
  totalFinal: number;
  onCheckout: () => void;
}

// Componente lateral, puramente apresentacional: recebe os valores
// já calculados (não consome useCart). Quem calcula é a CartPage (#127).
export default function CartSummary({
  itemCount,
  totalWithoutDiscount,
  totalDiscount,
  totalFinal,
  onCheckout,
}: CartSummaryProps) {
  const { t } = useTranslation();
  const hasDiscount = totalDiscount > 0;

  return (
    <aside className="flex flex-col gap-4 rounded-lg border border-muted-300 bg-white p-5">
      <h2 className="text-lg font-semibold text-muted-950">
        {t("components.cartSummary.title")}
      </h2>

      <p className="text-sm text-muted-700">
        {t("components.cartSummary.itemCount", { count: itemCount })}
      </p>

      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-muted-700">
          {t("components.cartSummary.total")}
        </span>
        {/* PriceTag (#101): total cheio tachado + total final em destaque */}
        <div className="text-right" aria-live="polite">
          <PriceTag
            originalPrice={totalWithoutDiscount}
            discountedPrice={totalFinal}
          />
        </div>
      </div>

      {hasDiscount && (
        <p className="text-sm font-medium text-success-700" aria-live="polite">
          {t("components.cartSummary.savings", { value: formatCurrency(totalDiscount) })}
        </p>
      )}

      <Button variant="contained" fullWidth onClick={onCheckout}>
        {t("components.cartSummary.closeOrder")}
      </Button>
    </aside>
  );
}