/**
 * Interface que representa uma avaliação de produto.
 * Baseada no schema de retorno da DummyJSON.
 */
export interface Review {
  /** Nota da avaliação (ex: 4.5) */
  rating: number;
  /** Comentário do avaliador */
  comment: string;
  /** Data da avaliação no formato ISO 8601 (ex: 2024-05-19T10:30:00.000Z) */
  date: string;
  /** Nome do avaliador */
  reviewerName: string;
  /** E-mail do avaliador */
  reviewerEmail: string;
}