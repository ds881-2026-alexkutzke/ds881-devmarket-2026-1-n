export type SortDirection = "asc" | "desc";

/**
 * Ordena um array com base em uma chave do objeto.
 * Retorna um novo array sem modificar o original.
 */
export function sortBy<T>(
  items: T[],
  key: keyof T,
  direction: SortDirection
): T[] {
  // Cria uma cópia do array para evitar mutação do original
  return [...items].sort((a, b) => {
    // Obtém os valores da chave informada
    const valueA = a[key];
    const valueB = b[key];

    // Mantém a posição caso os valores sejam iguais
    if (valueA === valueB) {
      return 0;
    }

    // Define o resultado da comparação
    const comparison = valueA > valueB ? 1 : -1;

    // Inverte a ordem caso seja decrescente
    return direction === "asc" ? comparison : -comparison;
  });
}