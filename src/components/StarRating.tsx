// alterar pela issue de criação do componente

export default function StarRating({ rating }: { rating: number }) {
  return <div className="text-sm text-yellow-500">Nota: {rating} estrelas</div>;
}