import type { Category } from "@/types/category.types";
import { FormControl, InputLabel, Select, MenuItem, CircularProgress, FormHelperText, type SelectChangeEvent } from "@mui/material";

interface CategoryFilterProps {
    value: string | null;
    onChange: (slug: string | null) => void;
    label: string;
    allCategoriesLabel: string;
    categories: Category[];
    loading?: boolean;
    error?: string | null;
}

function CategoryFilter({ value, onChange, label, allCategoriesLabel, categories, loading = false, error = null }: CategoryFilterProps) {

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value;
        onChange(selectedValue === '' ? null : selectedValue);
    };

    return (
        <FormControl fullWidth error={!!error} disabled={loading}>
            <InputLabel id="category-select-label">{label}</InputLabel>
            <Select
                labelId="category-select-label"
                id="category-select"
                value={value ?? ''}
                label={label}
                onChange={handleChange}
                endAdornment={
                    loading ? <CircularProgress color="inherit" size={20} sx={{ marginRight: 3 }} /> : null
                }
            >
                <MenuItem value="">
                    <em>{allCategoriesLabel}</em>
                </MenuItem>

                {categories.map((category: Category) => (
                    <MenuItem key={category.slug} value={category.slug}>
                        {category.name}
                    </MenuItem>
                ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
}

export default CategoryFilter;