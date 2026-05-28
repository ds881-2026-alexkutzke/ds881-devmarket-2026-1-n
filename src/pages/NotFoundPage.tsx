import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <main className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h1>{t("pages.notFound.title")}</h1>
      <p>{t("pages.notFound.description")}</p>
      <Button component={Link} to="/" variant="contained">
        {t("pages.notFound.backHome")}
      </Button>
    </main>
  );
};

export default NotFoundPage;
