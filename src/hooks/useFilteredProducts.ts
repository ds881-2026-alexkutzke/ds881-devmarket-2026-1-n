import type { Product } from "@/types/product.types";
import { sortBy as sortArray, type SortDirection } from "@/utils/arraySort";
import { paginate } from "@/utils/paginate";
import { useMemo } from "react";
import useProducts from "./useProducts";

export interface UseFilteredProductsParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxRating?: number;
  sortBy?: keyof Product;
  sortDirection?: SortDirection;
  page: number;
  pageSize: number;
}

export function useFilteredProducts({
  search,
  category,
  minPrice,
  maxPrice,
  minRating,
  maxRating,
  sortBy,
  sortDirection = "asc",
  page,
  pageSize,
}: UseFilteredProductsParams) {
  const { products, isLoading, error } = useProducts();

  const result = useMemo(() => {
    let filtered = products;

    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerSearch) ||
          p.description.toLowerCase().includes(lowerSearch),
      );
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }

    if (minRating !== undefined) {
      filtered = filtered.filter((p) => p.rating >= minRating);
    }
    if (maxRating !== undefined) {
      filtered = filtered.filter((p) => p.rating <= maxRating);
    }

    if (sortBy) {
      filtered = sortArray(filtered, sortBy, sortDirection);
    }

    const {
      items: paginatedProducts,
      totalPages,
      currentPage,
    } = paginate(filtered, page, pageSize);

    return {
      products: paginatedProducts,
      totalPages,
      currentPage,
    };
  }, [
    products,
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    sortBy,
    sortDirection,
    page,
    pageSize,
  ]);

  return {
    products: result.products,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
    isLoading,
    error,
  };
}

export default useFilteredProducts;
