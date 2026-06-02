// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useRecommendedProducts from '../../hooks/useRecommendedProducts';
import * as productService from '../../services/productService';
import type { Product } from '../../types/product.types';

const makeProduct = (
  id: number,
  category: string,
  discountPercentage: number,
): Product =>
  ({ id, category, discountPercentage } as unknown as Product);

describe('useRecommendedProducts', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('retorna no máximo 10 produtos, ordenados por desconto desc, das top 3 categorias', async () => {
    const products: Product[] = [];
    let id = 1;
    // A é top 1 (12 itens, descontos 0..11)
    for (let i = 0; i < 12; i++) products.push(makeProduct(id++, 'A', i));
    // B é top 2 (8 itens, descontos 50..57)
    for (let i = 0; i < 8; i++) products.push(makeProduct(id++, 'B', 50 + i));
    // C é top 3 (5 itens, descontos 20..24)
    for (let i = 0; i < 5; i++) products.push(makeProduct(id++, 'C', 20 + i));
    // D fica fora das top 3 mesmo tendo desconto altíssimo
    for (let i = 0; i < 2; i++) products.push(makeProduct(id++, 'D', 99));

    vi.spyOn(productService, 'getProducts').mockResolvedValue(products);

    const { result } = renderHook(() => useRecommendedProducts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.products.length).toBeGreaterThan(0));

    expect(result.current.products).toHaveLength(10);

    const discounts = result.current.products.map((p) => p.discountPercentage);
    expect(discounts).toEqual([...discounts].sort((a, b) => b - a));

    expect(result.current.products.every((p) => p.category !== 'D')).toBe(true);
  });

  it('exclui produtos cujos ids estão em excludeIds', async () => {
    vi.spyOn(productService, 'getProducts').mockResolvedValue([
      makeProduct(1, 'A', 90),
      makeProduct(2, 'A', 80),
      makeProduct(3, 'A', 70),
    ]);

    const { result } = renderHook(() => useRecommendedProducts([1]));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.products.length).toBeGreaterThan(0));

    const ids = result.current.products.map((p) => p.id);
    expect(ids).not.toContain(1);
    expect(ids).toContain(2);
    expect(ids).toContain(3);
  });

  it('retorna lista vazia quando não há produtos carregados', async () => {
    vi.spyOn(productService, 'getProducts').mockResolvedValue([]);

    const { result } = renderHook(() => useRecommendedProducts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.products).toEqual([]);
  });
});
