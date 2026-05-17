export function calculateDiscount(
  price: number,
  discountPercentage: number,
): number {
  if (price <= 0) return 0;
  if (!discountPercentage || discountPercentage <= 0) return price;
  if (discountPercentage >= 100) return 0;

  const discountAmount = price * (discountPercentage / 100);
  return Number((price - discountAmount).toFixed(2));
}
