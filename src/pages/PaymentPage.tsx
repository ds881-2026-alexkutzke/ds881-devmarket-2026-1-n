import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import useCart from "@/hooks/useCart";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { formatCurrency } from "@/utils/formatCurrency";

export default function PaymentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { subtotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("");

  useDocumentTitle(t("pages.payment.documentTitle"));

  const handleConfirm = () => {
    clearCart();
    navigate("/home");
  };

  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-xl font-semibold text-muted-950">
        {t("pages.payment.title")}
      </h1>

      <div className="space-y-6">
        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
        />

        <div className="rounded-md border border-muted-300 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm text-muted-700">
            <span>{t("pages.payment.summary.total")}</span>
            <strong className="text-base text-muted-950">
              {formatCurrency(subtotal)}
            </strong>
          </div>
        </div>

        <Button
          variant="contained"
          fullWidth
          disabled={!paymentMethod}
          onClick={handleConfirm}
        >
          {t("pages.payment.confirm")}
        </Button>
      </div>
    </main>
  );
}