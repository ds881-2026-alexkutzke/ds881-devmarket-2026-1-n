/**
 * Calcula o preço final de venda.
 * Semântica: preço original × (1 − %/100)
 */
export function calculateDiscountedPrice(
  price: number,
  discountPercentage: number,
): number {
  if (price <= 0) return 0;

  // Se não houver desconto, retorna o preço cheio
  if (!discountPercentage || discountPercentage <= 0) return price;

  // Desconto de 100% ou mais zera o preço
  if (discountPercentage >= 100) return 0;

  const finalPrice = price - price * (discountPercentage / 100);

  //parseFloat + toFixed para precisão de centavos e retorno do tipo number
  return parseFloat(finalPrice.toFixed(2));
}
