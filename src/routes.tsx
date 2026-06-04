import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import App from "@/App";
import MainLayoutPage from "@/pages/MainLayoutPage";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import PaymentPage from "@/pages/PaymentPage";
import NotFoundPage from "@/pages/NotFoundPage";
import CheckoutPage from "@/pages/CheckoutPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        element: <MainLayoutPage />,
        children: [
          { path: "home", element: <HomePage /> },
          { path: "search", element: <SearchPage /> },
          { path: "product/:id", element: <ProductPage /> },
          { path: "cart", element: <CartPage /> },
          { path: "checkout", element: <CheckoutPage /> },
          { path: "payment", element: <PaymentPage /> },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

// Remove a barra final do base do Vite ("/ds881-devmarket-2026-1-n/" -> "/ds881-devmarket-2026-1-n").
// Em dev o base é "/", resultando em "" -> usamos "/" como fallback.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export const router = createBrowserRouter(routes, { basename });
