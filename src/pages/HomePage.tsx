import { useEffect, useState } from 'react';
import { getFirstProduct } from '../services/productService';
import type { Product } from '../types/product.types.ts';

const HomePage = () => {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    getFirstProduct()
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, []);

  if (!product) return <div>Carregando prova de conceito...</div>;

  return (
    <main>
      <h1>PoC: Conexão com API</h1>
      <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p>Preço: ${product.price}</p>
      </div>
    </main>
  );
};

export default HomePage;
