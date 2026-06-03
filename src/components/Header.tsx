import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import SearchBar from "@/components/SearchBar";
import useProducts from "@/hooks/useProducts";

export default function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoading } = useProducts();

  return (
    <header className="w-full bg-[--var(bg)] p-3 box-border">
      <div className="mx-auto flex max-w-300 items-center justify-between gap-6 border border-[--var(bg)] bg-[--var(code-bg)] px-6 py-4">
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
        </div>

        <div className="flex-1 max-w-105">
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
        </div>
      </div>
    </header>
  );
}
