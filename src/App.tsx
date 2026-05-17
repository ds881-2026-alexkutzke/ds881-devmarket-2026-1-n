import { routes } from './routes';

function App() {
  const base = import.meta.env.BASE_URL; // '/dev-market/' em prod, '/' em local
  const currentPath = window.location.pathname.replace(base, '/');
  const route = routes.find(r => r.path === currentPath);

  return (
    <div className="app-container">
      {route ? <route.component /> : <h1>404 - Página não encontrada</h1>}
    </div>
  );
}

export default App;

