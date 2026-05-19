import { createHashRouter, type RouteObject } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export const router = createHashRouter(routes);
