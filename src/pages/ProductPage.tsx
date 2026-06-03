import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProduct } from "@/hooks/useProduct";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id);
  const { t } = useTranslation();

  if (loading) {
    return <div>{t("pages.product.loading")}</div>;
  }

  if (error) {
    return (
      <div>
        {t("pages.product.error")} {error.message}
      </div>
    );
  }

  if (!product) {
    return <div>{t("pages.product.notFound")}</div>;
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <p>
        {t("pages.product.price", {
          value: product.price.toFixed(2),
        })}
      </p>
    </div>
  );
};

export default ProductPage;
