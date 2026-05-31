// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useProducts from '../../hooks/useProducts';
import * as productService from '../../services/productService';
import type { Product } from '../../types/product.types';

describe('useProducts', () => {
  const mockProducts = [
    { 
      id: 1, 
      title: 'Produto Teste', 
      price: 10, 
      description: 'Descrição',
      discountPercentage: 0,
      rating: 4.5,
      stock: 5,
      brand: 'BrandA',
      category: 'category-a',
      thumbnail: '',
      images: [],
      reviews: []
    }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('deve retornar o estado inicial de loading e depois os produtos carregados', async () => {
    // Substituído 'as any' por type casting seguro para o TypeScript-ESLint
    const getProductsSpy = vi.spyOn(productService, 'getProducts')
      .mockResolvedValue(mockProducts as unknown as Product[]);

    const { result } = renderHook(() => useProducts());

    // Verifica o estado inicial (Loading)
    expect(result.current.isLoading).toBe(true);
    expect(result.current.products).toEqual([]);

    // Aguarda a resolução da Promise interna do useEffect
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
    expect(getProductsSpy).toHaveBeenCalledTimes(1);
  });

  it('deve lidar com cenários de erro corretamente', async () => {
    vi.spyOn(productService, 'getProducts').mockRejectedValue(new Error('Erro de Conexão'));

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBeDefined();
  });
});