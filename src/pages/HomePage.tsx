import { useEffect, useState } from 'react';
import { getFirstProduct } from '../services/productService';
import type { Product } from '../types/product.types.ts';

const HomePage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    getFirstProduct()
      .then(data => setProduct(data))
      .catch(() => setErro(true));
  }, []);

  if (erro) {
    return <div>Erro ao carregar produto.</div>;
  }

  if (!product) {
    return <div>Carregando prova de conceito...</div>;
  }

  return (
    <main>
      <h1>PoC: Conexão com API</h1>

      <div className="border border-[var(--border)] p-4">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p>Preço: ${product.price}</p>
      </div>

      {/* Exemplo de utilities Tailwind:
          - bg-red-500       => background vermelho
          - text-white       => cor do texto
          - text-xl          => tamanho do texto (xs, sm, base, lg, xl, 2xl...)
          - font-bold        => peso da fonte
          - underline        => sublinhado
          - px-6 py-2        => padding horizontal/vertical
          - mt-4             => margin top (mt, mb, ml, mr, mx, my)
          - rounded-lg       => bordas arredondadas
          - hover:bg-red-700 => muda a cor no hover
      */}
      <button className="bg-red-500 text-white text-xl font-bold underline px-6 py-2 mt-4 rounded-lg hover:bg-red-700">
        Exemplo Tailwind
      </button>
    </main>
  );
};

export default HomePage;