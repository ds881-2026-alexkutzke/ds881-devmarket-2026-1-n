/**
 * Pagina um array genérico, retornando os itens da página solicitada
 * junto com metadados de paginação.
 *
 * @param items - Array de itens a paginar
 * @param page - Número da página (1-indexado)
 * @param pageSize - Quantidade de itens por página
 */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): { items: T[]; totalPages: number; currentPage: number } {
  const totalPages = Math.ceil(items.length / pageSize) || 0;

  let currentPage = Math.max(1, page);
  if (totalPages > 0) {
    currentPage = Math.min(currentPage, totalPages);
  }

  const start = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);

  return { items: paginatedItems, totalPages, currentPage };
}
