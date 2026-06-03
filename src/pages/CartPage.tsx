import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/EmptyState";

export default function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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