import { routes } from './routes';

function App() {
  const currentPath = window.location.pathname;
  const route = routes.find(r => r.path === currentPath);

  return (
    <div className="app-container">
      {route ? <route.component /> : <h1>404 - Página não encontrada</h1>}
    </div>
  );
}

export default App;

