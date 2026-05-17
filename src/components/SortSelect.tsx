import { Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

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
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as SortOption);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="sort-select-label">Ordenar por</InputLabel>

      <Select
        labelId="sort-select-label"
        value={value}
        label="Ordenar por"
        onChange={handleChange}
      >
        <MenuItem value="relevance">
          Relevância
        </MenuItem>

        <MenuItem value="price-asc">
          Preço: menor primeiro
        </MenuItem>

        <MenuItem value="price-desc">
          Preço: maior primeiro
        </MenuItem>

        <MenuItem value="rating-desc">
          Avaliação: maior primeiro
        </MenuItem>

        <MenuItem value="rating-asc">
          Avaliação: menor primeiro
        </MenuItem>
      </Select>
    </FormControl>
  );
}