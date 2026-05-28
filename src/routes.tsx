import {
  createBrowserRouter,
  createHashRouter,
  type RouteObject,
} from "react-router-dom";

import App from "@/App";
import LandingPage from "@/pages/LandingPage";
import MainLayoutPage from "@/pages/MainLayoutPage";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import PaymentPage from "@/pages/PaymentPage";
import NotFoundPage from "@/pages/NotFoundPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        element: <MainLayoutPage />,
        children: [
          { path: "home", element: <HomePage /> },
          { path: "search", element: <SearchPage /> },
          { path: "product/:id", element: <ProductDetailPage /> },
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

export const router = import.meta.env.DEV
  ? createBrowserRouter(routes)
  : createHashRouter(routes);
