import { formatCurrency } from '@/utils/formatCurrency';

export default function PriceTag({ price }: { price: number }) {
  return <div className="font-bold text-primary-600">{formatCurrency(price)}</div>;
}