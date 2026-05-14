import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/home',
    component: HomePage,
  },
  {
    path: '/cart',
    component: CartPage,
  },
];
