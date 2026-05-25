import type { Product } from "@/types/product.types";
import { httpGet } from "./httpService";

export const getFirstProduct = (): Promise<Product> =>
  httpGet<Product>("/products/1");
