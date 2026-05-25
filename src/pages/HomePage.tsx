import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { getFirstProduct } from "@/services/productService";
import type { Product } from "@/types/product.types.ts";
import { formatCurrency } from "@/utils/formatCurrency";
import Header from "@/components/Header.tsx";

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(false);

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
      </main>
    </>
  );
};

export default HomePage;
