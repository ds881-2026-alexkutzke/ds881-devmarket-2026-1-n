import {
  createBrowserRouter,
  createHashRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
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

export const router = import.meta.env.DEV
  ? createBrowserRouter(routes)
  : createHashRouter(routes);
