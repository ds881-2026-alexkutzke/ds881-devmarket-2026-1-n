export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// Opcional: Interface para quando a API retornar a lista completa (ex: /products)
export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
