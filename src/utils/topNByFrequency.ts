/**
 * Retorna os N itens mais frequentes de um array.
 *
 * A função percorre a lista, conta quantas vezes cada item aparece
 * e retorna os itens com maior frequência.
 *
 * Em caso de empate de frequência, a ordenação mantém
 * a ordem da primeira aparição no array original.
 *
 * @typeParam T - Tipo dos itens do array.
 *
 * @param items - Lista de itens que será analisada.
 * @param n - Quantidade de itens mais frequentes que devem ser retornados.
 *
 * @returns Um array contendo os N itens mais frequentes.
 *
 * @example
 * ```ts
 * const categories = [
 *   "tech",
 *   "books",
 *   "tech",
 *   "games",
 *   "books",
 *   "tech",
 * ];
 *
 * const result = topNByFrequency(categories, 2);
 *
 * // result:
 * // ["tech", "books"]
 * ```
 */
export function topNByFrequency<T>(items: T[], n: number): T[] {
  const frequencyMap = new Map<
    T,
    {
      count: number;
      firstIndex: number;
    }
  >();

  items.forEach((item, index) => {
    const existing = frequencyMap.get(item);

    if (existing) {
      existing.count += 1;
    } else {
      frequencyMap.set(item, {
        count: 1,
        firstIndex: index,
      });
    }
  });

  return [...frequencyMap.entries()]
    .sort((a, b) => {
      const [, dataA] = a;
      const [, dataB] = b;

      // Ordena pela maior frequência
      if (dataB.count !== dataA.count) {
        return dataB.count - dataA.count;
      }

      // Em caso de empate:
      // mantém quem apareceu primeiro no array original
      return dataA.firstIndex - dataB.firstIndex;
    })
    .slice(0, n)
    .map(([item]) => item);
}