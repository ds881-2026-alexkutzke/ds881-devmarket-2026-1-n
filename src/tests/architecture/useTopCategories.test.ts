// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useTopCategories from '../../hooks/useTopCategories';
import * as productService from '../../services/productService';
import type { Product } from '../../types/product.types';

const makeProduct = (id: number, category: string): Product =>
  ({ id, category } as unknown as Product);

describe('useTopCategories', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('retorna as N categorias mais frequentes', async () => {
    vi.spyOn(productService, 'getProducts').mockResolvedValue([
      makeProduct(1, 'A'),
      makeProduct(2, 'A'),
      makeProduct(3, 'A'),
      makeProduct(4, 'B'),
      makeProduct(5, 'B'),
      makeProduct(6, 'C'),
    ]);

    const { result } = renderHook(() => useTopCategories(2));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.categories).toEqual(['A', 'B']);
  });

  it('limita o resultado ao parâmetro n', async () => {
    vi.spyOn(productService, 'getProducts').mockResolvedValue([
      makeProduct(1, 'A'),
      makeProduct(2, 'B'),
      makeProduct(3, 'C'),
    ]);

    const { result } = renderHook(() => useTopCategories(1));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.categories).toHaveLength(1);
  });

  it('propaga o erro de useProducts', async () => {
    vi.spyOn(productService, 'getProducts').mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useTopCategories(3));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBeDefined();
  });
});
