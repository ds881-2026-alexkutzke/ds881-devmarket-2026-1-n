import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ProductCarousel from "@/components/ProductCarousel";
import Header from "@/components/Header.tsx";
import { useCartProductIds } from "@/hooks/useCartProductIds";
import { useRecommendedProducts } from "@/hooks/useRecommendedProducts";
import { getFirstProduct } from "@/services/productService";
import type { Product } from "@/types/product.types";
import { formatCurrency } from "@/utils/formatCurrency";

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(false);
  const idsDoCarrinho = useCartProductIds();
  const recommendedProducts = useRecommendedProducts({
    excludeIds: idsDoCarrinho,
  });

  useEffect(() => {
    getFirstProduct()
      .then((data) => setProduct(data))
      .catch(() => setError(true));
  }, []);

  if (error) {
    return <div>{t("pages.home.error")}</div>;
  }

  if (!product) {
    return <div>{t("pages.home.loading")}</div>;
  }

  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language === "pt-BR" ? "en" : "pt-BR");

  return (
    <>
      <Header />
      <main>
        <h1>{t("pages.home.title")}</h1>

        <div className="border border-(--border) p-4">
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p>
            {t("pages.home.priceLabel")} {formatCurrency(product.price)}
          </p>
        </div>

        <div className="mt-4 flex gap-2 justify-center">
          <Button variant="contained" color="error">
            {t("pages.home.exampleButton")}
          </Button>
          <Button variant="contained" onClick={toggleLanguage}>
            {t("components.languageToggle.toggleLanguage")}
          </Button>
        </div>

        <ProductCarousel
          title={t("pages.home.recommendedProducts")}
          products={recommendedProducts.products}
          loading={recommendedProducts.loading}
          error={recommendedProducts.error}
          onProductClick={(recommendedProduct) =>
            navigate(`/product/${recommendedProduct.id}`)
          }
        />
      </main>
    </>
  );
};

export default HomePage;
