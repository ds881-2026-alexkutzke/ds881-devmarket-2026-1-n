import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import EmptyState from "@/components/EmptyState";
import ProductRow from "@/components/ProductRow";
import useCart from "@/hooks/useCart";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { calculateDiscountedPrice } from "@/utils/calculateDiscountedPrice";
import { formatCurrency } from "@/utils/formatCurrency";

export default function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem } = useCart();

  useDocumentTitle(t("pages.cart.documentTitle"));

  const subtotal = items.reduce(
    (total, item) =>
      total +
      calculateDiscountedPrice(
        item.product.price,
        item.product.discountPercentage,
      ) *
        item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <main>
        <EmptyState
          title={t("pages.cart.empty.title")}
          action={{
            label: t("pages.cart.empty.continueShopping"),
            onClick: () => navigate("/home"),
          }}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 p-4 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-muted-950">
          {t("pages.cart.title")}
        </h1>

        <div className="space-y-3">
          {items.map((item) => (
            <ProductRow
              key={item.product.id}
              product={item.product}
              quantity={item.quantity}
              onQuantityChange={(quantity) =>
                updateQuantity(item.product.id, quantity)
              }
              onRemove={() => removeItem(item.product.id)}
              onClickProduct={() => navigate(`/product/${item.product.id}`)}
            />
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-md border border-muted-300 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-muted-950">
          {t("pages.cart.summary.title")}
        </h2>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-700">
          <span>{t("pages.cart.summary.subtotal")}</span>
          <strong className="text-base text-muted-950">
            {formatCurrency(subtotal)}
          </strong>
        </div>

        <Button
          variant="contained"
          fullWidth
          className="mt-6"
          onClick={() => navigate("/checkout")}
        >
          {t("pages.cart.summary.checkout")}
        </Button>
      </aside>
    </main>
  );
}
