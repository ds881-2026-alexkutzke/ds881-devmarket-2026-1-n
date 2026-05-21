import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material";
import { useTranslation } from "react-i18next";

export type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "rating-asc";

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortSelect({
  value,
  onChange,
}: SortSelectProps) {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as SortOption);
  };

  const label = t("components.sortSelect.label");

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="sort-select-label">{label}</InputLabel>

      <Select
        id="sort-select"
        labelId="sort-select-label"
        value={value}
        label={label}
        onChange={handleChange}
      >
        <MenuItem value="relevance">
          {t("components.sortSelect.options.relevance")}
        </MenuItem>

        <MenuItem value="price-asc">
          {t("components.sortSelect.options.priceAsc")}
        </MenuItem>

        <MenuItem value="price-desc">
          {t("components.sortSelect.options.priceDesc")}
        </MenuItem>

        <MenuItem value="rating-desc">
          {t("components.sortSelect.options.ratingDesc")}
        </MenuItem>

        <MenuItem value="rating-asc">
          {t("components.sortSelect.options.ratingAsc")}
        </MenuItem>
      </Select>
    </FormControl>
  );
}
