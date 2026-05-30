import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import CartProvider from './components/CartProvider';

function App() {

  return (
    <CartProvider>
      <div className="app-container">
       <Outlet />
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;

