import type { Product } from "@/types/product.types";
import { useTranslation } from "react-i18next";

interface ProductInfoSectionProps {
  product: Product;
}

export default function ProductInfoSection({ product }: ProductInfoSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-muted-300 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-muted-950">
        {t("components.productInfoSection.title")}
      </h2>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1 sm:col-span-2">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-500">
            {t("components.productInfoSection.description")}
          </dt>
          <dd className="text-sm text-muted-700">{product.description}</dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-500">
            {t("components.productInfoSection.category")}
          </dt>
          <dd className="text-sm text-muted-950">{product.category}</dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-500">
            {t("components.productInfoSection.brand")}
          </dt>
          <dd className="text-sm text-muted-950">{product.brand}</dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-500">
            {t("components.productInfoSection.sku")}
          </dt>
          <dd className="text-sm text-muted-950">{product.sku}</dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-500">
            {t("components.productInfoSection.dimensions")}
          </dt>
          <dd className="text-sm text-muted-950">
            {t("components.productInfoSection.height")}: {product.dimensions.height}
            {" · "}
            {t("components.productInfoSection.width")}: {product.dimensions.width}
            {" · "}
            {t("components.productInfoSection.depth")}: {product.dimensions.depth}
          </dd>
        </div>
      </dl>
    </section>
  );
}
