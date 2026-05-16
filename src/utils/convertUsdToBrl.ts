/**
 * Converte um valor em Dólares (USD) para Reais (BRL).
 */
export function convertUsdToBrl(usdValue: number, rate: number): number {
  return usdValue * rate;
}