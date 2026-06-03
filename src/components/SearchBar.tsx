import { useState, useEffect } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import useDebounce from "@/hooks/useDebounce";

interface SearchBarProps {
  onSearchChange?: (query: string) => void;
  initialValue?: string;
  disabled?: boolean;
}

export default function SearchBar({
  onSearchChange,
  initialValue = "",
  disabled = false,
}: SearchBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(initialValue);
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedQuery);
    }
  }, [debouncedQuery, onSearchChange]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const forceSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      forceSearch();
    }
  };

  return (
    <div className="w-full max-w-md">
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder={t("components.searchBar.placeholder")}
        value={searchQuery}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={forceSearch}
                  aria-label={t("components.searchBar.searchAriaLabel")}
                  edge="end"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </div>
  );
}
