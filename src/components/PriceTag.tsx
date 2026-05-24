//Alterar pela issue de criação do componente

export default function PriceTag({ price }: { price: number }) {
  return <div className="font-bold text-primary-600">R$ {price}</div>;
}