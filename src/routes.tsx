import { createHashRouter, type RouteObject } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import CheckoutPage from "@/pages/CheckoutPage";
import App from "@/App";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

export const router = createHashRouter(routes);
