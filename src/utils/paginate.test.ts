import { describe, it, expect } from 'vitest';
import { paginate } from './paginate';

describe('paginate', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it('deve retornar os itens da página solicitada', () => {
    const result = paginate(items, 2, 3);
    expect(result.items).toEqual([4, 5, 6]);
    expect(result.totalPages).toBe(4);
    expect(result.currentPage).toBe(2);
  });

  it('deve retornar a última página parcial corretamente', () => {
    const result = paginate([1, 2, 3, 4, 5], 2, 3);
    expect(result.items).toEqual([4, 5]);
    expect(result.totalPages).toBe(2);
    expect(result.currentPage).toBe(2);
  });

  it('deve retornar resultado vazio para array vazio', () => {
    const result = paginate([], 1, 5);
    expect(result.items).toEqual([]);
    expect(result.totalPages).toBe(0);
    expect(result.currentPage).toBe(1);
  });

  it('deve ajustar page para 1 quando page < 1', () => {
    const result = paginate([1, 2, 3, 4, 5], 0, 2);
    expect(result.currentPage).toBe(1);
    expect(result.items).toEqual([1, 2]);
  });

  it('deve ajustar page para a última quando page > totalPages', () => {
    const result = paginate([1, 2, 3, 4, 5], 99, 2);
    expect(result.currentPage).toBe(3);
    expect(result.items).toEqual([5]);
  });

  it('deve funcionar com tipos genéricos (objetos)', () => {
    const objetos = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = paginate(objetos, 1, 2);
    expect(result.items).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.totalPages).toBe(2);
    expect(result.currentPage).toBe(1);
  });
});
