import type { Product } from "../types/product.types";

// Retorna N produtos com maior desconto ordenados descrescentemente

export function topNByDiscount(products: Product[], n: number): Product[] {
  return [...products] //faz um cópia do array de entrada
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, n);
}