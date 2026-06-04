import { ArrowForward, CheckCircleOutline, Public } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import AboutValueCard from "@/components/AboutValueCard";

const VALUES = [
  { key: "quality", icon: <CheckCircleOutline fontSize="large" /> },
  { key: "experience", icon: <ArrowForward fontSize="large" /> },
  { key: "growth", icon: <Public fontSize="large" /> },
];

export default function AboutValuesSection() {
  const { t } = useTranslation();

  return (
    <section className="flex w-full flex-col gap-8 px-4 py-10">
      <h2 className="text-center text-3xl font-semibold text-muted-950">
        {t("components.aboutValuesSection.title")}
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {VALUES.map((value) => (
          <AboutValueCard
            key={value.key}
            icon={value.icon}
            title={t(`components.aboutValuesSection.values.${value.key}.title`)}
            description={t(
              `components.aboutValuesSection.values.${value.key}.description`,
            )}
          />
        ))}
      </div>
    </section>
  );
}