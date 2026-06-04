import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategoryFilter from "@/components/CategoryFilter";
import Pagination from "@/components/Pagination";
import PriceFilter, { type PriceFilterValue } from "@/components/PriceFilter";
import ProductGrid from "@/components/ProductGrid";
import RatingFilter from "@/components/RatingFilter";
import SortSelect, { type SortOption } from "@/components/SortSelect";
import useProducts from "@/hooks/useProducts";
import type { Category } from "@/types/category.types";
import type { Product } from "@/types/product.types";
import { sortBy } from "@/utils/arraySort";
import { paginate } from "@/utils/paginate";

const PAGE_SIZE = 12;

const toDisplayLabel = (slug: string) =>
  slug
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");

export default function SearchPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";

  const { products, isLoading, error } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceMin, setPriceMin] = useState(0);
  // null = sem teto explícito: usa o maior preço disponível como padrão.
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [ratingRange, setRatingRange] = useState({ min: 0, max: 5 });
  const [selectedSort, setSelectedSort] = useState<SortOption>("relevance");
  const [page, setPage] = useState(1);

  // Volta para a primeira página quando a busca da URL muda
  // (padrão recomendado de ajuste de estado durante a renderização).
  const [lastQuery, setLastQuery] = useState(query);
  if (query !== lastQuery) {
    setLastQuery(query);
    setPage(1);
  }

  const maxPrice = useMemo(
    () => Math.ceil(products.reduce((max, product) => Math.max(max, product.price), 0)),
    [products],
  );
  const effectiveMax = priceMax ?? maxPrice;

  const categories = useMemo<Category[]>(() => {
    const slugs = [...new Set(products.map((product) => product.category))].sort();

    return slugs.map((slug) => ({
      slug,
      name: toDisplayLabel(slug),
      url: "",
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesQuery =
        !query ||
        (product.title ?? "").toLowerCase().includes(query) ||
        (product.description ?? "").toLowerCase().includes(query) ||
        (product.brand ?? "").toLowerCase().includes(query);

      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;

      const matchesPrice =
        product.price >= priceMin &&
        (effectiveMax <= 0 || product.price <= effectiveMax);

      const matchesRating =
        product.rating >= ratingRange.min && product.rating <= ratingRange.max;

      return matchesQuery && matchesCategory && matchesPrice && matchesRating;
    });

    if (selectedSort === "relevance") return filtered;
    if (selectedSort === "price-asc") return sortBy(filtered, "price", "asc");
    if (selectedSort === "price-desc") return sortBy(filtered, "price", "desc");
    if (selectedSort === "rating-asc") return sortBy(filtered, "rating", "asc");

    return sortBy(filtered, "rating", "desc");
  }, [products, query, selectedCategory, priceMin, effectiveMax, ratingRange, selectedSort]);

  const pagination = useMemo(
    () => paginate(filteredProducts, page, PAGE_SIZE),
    [filteredProducts, page],
  );

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleCategoryChange = (slug: string | null) => {
    setSelectedCategory(slug);
    setPage(1);
  };

  const handlePriceChange = (value: PriceFilterValue) => {
    setPriceMin(value.min);
    setPriceMax(value.max);
    setPage(1);
  };

  const handleRatingChange = (range: { min: number; max: number }) => {
    setRatingRange(range);
    setPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setRatingRange({ min: 0, max: 5 });
    setSelectedSort("relevance");
    setPriceMin(0);
    setPriceMax(null);
    setPage(1);
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-10 pt-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-muted-950">
          {query
            ? t("pages.search.resultsFor", { query })
            : t("pages.search.title")}
        </h1>
        {!isLoading && !error && (
          <p className="text-sm text-muted-700">
            {t("pages.search.resultsCount", { count: filteredProducts.length })}
          </p>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="flex h-fit flex-col gap-5 rounded-xl border border-muted-300 bg-white p-4">
          <h2 className="text-base font-semibold text-muted-950">
            {t("pages.search.filtersTitle")}
          </h2>

          <CategoryFilter
            value={selectedCategory}
            onChange={handleCategoryChange}
            label={t("pages.search.categoryLabel")}
            allCategoriesLabel={t("pages.search.allCategories")}
            categories={categories}
            loading={isLoading}
          />

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-muted-700">
              {t("pages.search.priceTitle")}
            </h3>
            <PriceFilter
              min={priceMin}
              max={effectiveMax}
              onChange={handlePriceChange}
            />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-muted-700">
              {t("pages.search.ratingTitle")}
            </h3>
            <RatingFilter
              min={ratingRange.min}
              max={ratingRange.max}
              onChange={handleRatingChange}
            />
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-1 rounded-md border border-muted-300 px-4 py-2 text-sm font-medium text-muted-700 transition hover:bg-muted-50 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            {t("pages.search.clearFilters")}
          </button>
        </aside>

        <section className="flex flex-col gap-6">
          <div className="flex justify-end">
            <div className="w-full sm:w-[260px]">
              <SortSelect value={selectedSort} onChange={handleSortChange} />
            </div>
          </div>

          <ProductGrid
            products={pagination.items}
            isLoading={isLoading}
            error={
              error instanceof Error
                ? error
                : error
                  ? new Error(String(error))
                  : null
            }
            onProductClick={handleProductClick}
          />

          {!isLoading && !error && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </section>
      </div>
    </main>
  );
}
