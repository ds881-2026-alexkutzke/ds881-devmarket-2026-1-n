import {
  createBrowserRouter,
  type RouteObject,
} from 'react-router-dom';

import HomePage from './pages/HomePage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';


export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});