import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/EmptyState";
import QuantitySelector from "@/components/QuantitySelector";
import useCart from "@/hooks/useCart";
import { formatCurrency } from "@/utils/formatCurrency";

export default function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } =
    useCart();

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
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-12 pt-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold text-muted-950">
          {t("pages.cart.title")}
        </h1>
        <span className="text-sm text-muted-700">
          {t("pages.cart.itemsCount", { count: itemCount })}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col gap-4">
          {items.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="flex flex-col gap-4 rounded-xl border border-muted-300 bg-white p-4 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => navigate(`/product/${product.id}`)}
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-muted-50 p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <img
                  src={product.thumbnail}
                  alt={t("pages.cart.itemImageAlt", { title: product.title })}
                  className="h-full w-full object-contain"
                />
              </button>

              <div className="flex flex-1 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="text-left text-sm font-medium text-muted-950 hover:text-primary-700"
                >
                  {product.title}
                </button>
                <span className="text-xs text-muted-500">
                  {t("pages.cart.unitPrice")}: {formatCurrency(product.price)}
                </span>

                <div className="mt-2">
                  <QuantitySelector
                    value={quantity}
                    min={1}
                    max={product.stock}
                    onChange={(nextQuantity) =>
                      updateQuantity(product.id, nextQuantity)
                    }
                    onRemove={() => removeItem(product.id)}
                  />
                </div>
              </div>

              <strong className="text-base text-muted-950 sm:text-right">
                {formatCurrency(product.price * quantity)}
              </strong>
            </li>
          ))}

          <button
            type="button"
            onClick={clearCart}
            className="w-fit text-sm font-medium text-danger-700 transition hover:text-danger-500"
          >
            {t("pages.cart.clear")}
          </button>
        </ul>

        <aside className="flex h-fit flex-col gap-4 rounded-xl border border-muted-300 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-muted-950">
            {t("pages.cart.summary.title")}
          </h2>

          <div className="flex items-center justify-between text-sm text-muted-700">
            <span>{t("pages.cart.summary.subtotal")}</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex items-center justify-between border-t border-muted-300 pt-3 text-base font-semibold text-muted-950">
            <span>{t("pages.cart.summary.total")}</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <Button variant="contained" fullWidth onClick={() => navigate("/checkout")}>
            {t("pages.cart.summary.checkout")}
          </Button>
        </aside>
      </div>
    </main>
  );
}