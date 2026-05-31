import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import type { Category } from "@/types/category.types";

interface CategoryChipProps {
  category: Category;
  onClick: (category: Category) => void;
}

const CategoryChip = ({ category, onClick }: CategoryChipProps) => {
  const { t } = useTranslation();

  return (
    <Chip
      label={category.name}
      onClick={() => onClick(category)}
      aria-label={t("components.categoryChip.label", { name: category.name })}
      className="rounded-full cursor-pointer font-medium transition-all duration-200 hover:shadow-md"
      sx={{
        borderRadius: "9999px",
        fontWeight: 500,
        "&:hover": {
          filter: "brightness(0.92)",
        },
        "&:focus-visible": {
          outline: "2px solid var(--color-primary-500)",
          outlineOffset: "2px",
        },
      }}
    />
  );
};

export default CategoryChip;
