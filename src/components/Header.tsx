import { useNavigate } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-gray-100 p-3 box-border">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 border border-gray-200 bg-white px-6 py-4">
        
        <div className="flex items-center gap-7">
          <span
            onClick={() => navigate('/home')}
            className="cursor-pointer select-none text-2xl font-bold"
          >
            DevMarket
          </span>

          <span
            onClick={() => navigate('/home')}
            className="cursor-pointer text-base font-medium"
          >
            Início
          </span>
        </div>

        <div className="flex-1 max-w-[420px]">
          <input
            type="text"
            placeholder="Buscar produtos..."
            disabled
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-5">
          <HomeIcon
            onClick={() => navigate('/home')}
            className="cursor-pointer"
          />

          <ShoppingCartIcon
            onClick={() => navigate('/cart')}
            className="cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
}