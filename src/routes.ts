import HomePage from './pages/HomePage';

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: HomePage,
  },
];
