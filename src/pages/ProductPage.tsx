import { ArrowBack } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import EmptyState from "@/components/EmptyState";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductInfoSection from "@/components/ProductInfoSection";
import PriceTag from "@/components/PriceTag";
import QuantitySelector from "@/components/QuantitySelector";
import ReviewList from "@/components/ReviewList";
import StarRating from "@/components/StarRating";
import useCart from "@/hooks/useCart";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { getProductsById } from "@/services/productService";
import type { Product } from "@/types/product.types";
import { calculateDiscountedPrice } from "@/utils/calculateDiscountedPrice";

type LoadState = {
  forId: number;
  status: "ok" | "error";
  product: Product | null;
};

export default function ProductPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const productId = Number(id);
  const isValidId = Number.isFinite(productId);

  const [loadState, setLoadState] = useState<LoadState | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Reseta a quantidade ao trocar de produto (ajuste de estado em render).
  const [quantityForId, setQuantityForId] = useState(productId);
  if (quantityForId !== productId) {
    setQuantityForId(productId);
    setQuantity(1);
  }

  useEffect(() => {
    if (!isValidId) return;

    let isActive = true;

    getProductsById(productId)
      .then((response) => {
        if (isActive) {
          setLoadState({ forId: productId, status: "ok", product: response });
        }
      })
      .catch(() => {
        if (isActive) {
          setLoadState({ forId: productId, status: "error", product: null });
        }
      });

    return () => {
      isActive = false;
    };
  }, [productId, isValidId]);

  // Enquanto o resultado carregado não corresponder ao id atual, é loading.
  const isResolved = loadState !== null && loadState.forId === productId;
  const isLoading = isValidId && !isResolved;
  const isError = !isValidId || (isResolved && loadState.status === "error");
  const product = isResolved && loadState.status === "ok" ? loadState.product : null;

  useDocumentTitle(product?.title ?? t("pages.product.loading"));

  if (isLoading) {
    return (
      <main className="py-16 text-center text-muted-700">
        {t("pages.product.loading")}
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8">
        <EmptyState
          title={t("pages.product.notFound.title")}
          description={t("pages.product.notFound.description")}
          action={{
            label: t("pages.product.notFound.back"),
            onClick: () => navigate("/search"),
          }}
        />
      </main>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage,
  );

  const handleAddToCart = () => {
    addItem(product, quantity);
    navigate("/cart");
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-12 pt-4">
      <button
        type="button"
        onClick={() => navigate("/search")}
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-primary-700 transition hover:text-primary-500"
      >
        <ArrowBack fontSize="small" />
        {t("pages.product.back")}
      </button>

      <section className="grid gap-8 lg:grid-cols-2">
        <ProductImageGallery
          images={product.images.length > 0 ? product.images : [product.thumbnail]}
          alt={t("components.productCard.imageAlt", { title: product.title })}
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-500">
              {product.brand}
            </span>
            <h1 className="text-2xl font-bold text-muted-950">{product.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} />
            <span className="text-sm text-muted-700">
              {t("pages.product.reviewsCount", { count: product.reviews.length })}
            </span>
          </div>

          <div className="text-2xl">
            <PriceTag originalPrice={product.price} discountedPrice={discountedPrice} />
          </div>

          <p className="text-sm text-muted-700">{product.description}</p>

          <p
            className={
              isOutOfStock
                ? "text-sm font-medium text-danger-700"
                : "text-sm font-medium text-success-700"
            }
          >
            {isOutOfStock
              ? t("pages.product.outOfStock")
              : t("pages.product.inStock", { count: product.stock })}
          </p>

          {!isOutOfStock && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-700">
                {t("pages.product.quantity")}
              </span>
              <QuantitySelector
                value={quantity}
                min={1}
                max={product.stock}
                onChange={setQuantity}
                onRemove={() => setQuantity(1)}
              />
            </div>
          )}

          <Button
            variant="contained"
            size="large"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            sx={{ alignSelf: "flex-start", mt: 1 }}
          >
            {t("pages.product.addToCart")}
          </Button>
        </div>
      </section>

      <ProductInfoSection product={product} />

      <ReviewList rating={product.rating} reviews={product.reviews} />
    </main>
  );
}
