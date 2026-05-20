import type { Category } from "./category.types";
import type { Review } from "./review.types";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: Category['slug']; //Pega o slug da Categoria;
  thumbnail: string;
  images: string[];
  reviews: Review[];
}

// Opcional: Interface para quando a API retornar a lista completa (ex: /products)
export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
