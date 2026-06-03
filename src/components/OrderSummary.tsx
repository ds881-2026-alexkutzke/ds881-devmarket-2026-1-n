import { useTranslation } from "react-i18next";
import type { OrderTotals } from "@/types/order.types";
import { formatCurrency } from "@/utils/formatCurrency";

export interface OrderSummaryProps {
  totals: OrderTotals;
  disabled?: boolean;
  onConfirm: () => void;
}

export default function OrderSummary({
  totals,
  disabled = false,
  onConfirm,
}: OrderSummaryProps) {
  const { t } = useTranslation();

  return (
    <section className="rounded-lg border border-muted-300 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {t("components.orderSummary.title")}
        </h2>
      </div>

      <dl className="space-y-3 text-sm text-muted-950">
        <div className="flex items-center justify-between">
          <dt>{t("components.orderSummary.subtotal")}</dt>
          <dd>{formatCurrency(totals.subtotal)}</dd>
        </div>

        <div className="flex items-center justify-between">
          <dt>{t("components.orderSummary.discount")}</dt>
          <dd className="text-danger-700">- {formatCurrency(totals.discount)}</dd>
        </div>

        <div className="flex items-center justify-between border-t border-muted-200 pt-3 font-semibold">
          <dt>{t("components.orderSummary.total")}</dt>
          <dd>{formatCurrency(totals.total)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled}
        className="mt-6 w-full rounded-md bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t("components.orderSummary.confirmButton")}
      </button>
    </section>
  );
}
