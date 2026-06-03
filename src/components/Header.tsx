import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import SearchBar from "@/components/SearchBar";
import useProducts from "@/hooks/useProducts";

export default function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isLoading } = useProducts();

  const toggleLang = () => {
    const newLang = i18n.language?.startsWith('pt') ? 'en' : 'pt-BR';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="w-full bg-gray-100 p-3 box-border">
      <div className="flex w-full items-center justify-between gap-6 border border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-7">
          <span
            onClick={() => navigate("/home")}
            className="cursor-pointer select-none text-2xl font-bold"
          >
            {t("components.header.brand")}
          </span>

          <span
            onClick={() => navigate("/home")}
            className="cursor-pointer text-base font-medium"
          >
            {t("components.header.home")}
          </span>

          <span className="text-base font-medium text-muted-700">
            {t('components.header.about')}
          </span>
        </div>

        <div className="flex-1 max-w-[420px]">
          <SearchBar disabled={isLoading} />
        </div>

        <div className="flex items-center gap-5">
          <HomeIcon
            onClick={() => navigate("/home")}
            className="cursor-pointer"
          />

          <ShoppingCartIcon
            onClick={() => navigate("/cart")}
            className="cursor-pointer"
          />
          <button
            onClick={toggleLang}
            aria-label={t('components.header.toggleLanguage')}
            className="ml-2 px-3 py-1 border rounded text-sm"
          >
            {i18n.language?.startsWith('pt') ? 'PT' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
}
