import type { Product } from "@/types/product.types";
import type { ProductResponse } from "@/types/product.types";
import { httpGet } from "./httpService";

export const getFirstProduct = (): Promise<Product> =>
  httpGet<Product>("/products/1");

export const getProductById = (id: number): Promise<Product> =>
  httpGet<Product>(`/products/${id}`);

export const getRecommendedProducts = async (
  excludeIds: number[] = [],
): Promise<Product[]> => {
  const excluded = new Set(excludeIds);
  const data = await httpGet<ProductResponse>("/products?limit=20");

  return data.products.filter((product) => !excluded.has(product.id));
};
