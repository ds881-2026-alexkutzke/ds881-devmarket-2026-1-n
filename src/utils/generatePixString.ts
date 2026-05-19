/**
 * Gera uma string decorativa para representar um PIX copia-e-cola no projeto.
 *
 * Esta string nao segue o padrao EMV/BR Code e nao e um PIX valido para
 * pagamentos reais.
 */
export function generatePixString(amount: number, orderId: string): string {
  return `DEVMARKET|${amount}|${orderId}`;
}
