/**
 * Cria uma versão "debounced" da função recebida.
 *
 * Uso típico:
 * Evitar múltiplas chamadas consecutivas em inputs de busca,
 * aguardando o usuário parar de digitar antes de executar a função.
 *
 * Exemplo:
 * const debouncedSearch = debounce(handleSearch, 300);
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}