import { useEffect, useState } from "react";
import { getFirstProduct } from "@/services/productService";
import type { Product } from "@/types/product.types";
import { formatCurrency } from "@/utils/formatCurrency";
import { useTranslation } from "react-i18next";
const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    getFirstProduct()
      .then((data) => setProduct(data))
      .catch(() => setErro(true));
  }, []);

  if (erro) {
    return <div>{t("home.error")}</div>;
  }

  if (!product) {
    return <div>{t("home.loading")}</div>;
  }

  return (
    <main>
      <h1>{t("home.title")}</h1>

      <div className="border border-[var(--border)] p-4">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p>
          {t("home.priceLabel")} {formatCurrency(product.price)}
        </p>
      </div>

      {/* Exemplo de utilities Tailwind:
          - bg-red-500       => background vermelho
          - text-white       => cor do texto
          - text-xl          => tamanho do texto (xs, sm, base, lg, xl, 2xl...)
          - font-bold        => peso da fonte
          - underline        => sublinhado
          - px-6 py-2        => padding horizontal/vertical
          - mt-4             => margin top (mt, mb, ml, mr, mx, my)
          - rounded-lg       => bordas arredondadas
          - hover:bg-red-700 => muda a cor no hover
      */}
      <div className="mt-4 flex gap-2">
        <button className="bg-red-500 text-white text-xl font-bold underline px-6 py-2 rounded-lg hover:bg-red-700">
          {t("home.exampleButton")}
        </button>
        <button
          onClick={() =>
            i18n.changeLanguage(i18n.language === "pt-BR" ? "en" : "pt-BR")
          }
          className="bg-blue-600 text-white text-base font-medium px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {t("home.toggleLanguage")}
        </button>
      </div>
    </main>
  );
};

export default HomePage;
