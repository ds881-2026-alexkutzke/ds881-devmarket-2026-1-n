import type { Product } from "@/types/product.types";
import { httpGet } from "./httpService";

export const getFirstProduct = async (): Promise<Product> => {
  return httpGet("/products/1");
};
