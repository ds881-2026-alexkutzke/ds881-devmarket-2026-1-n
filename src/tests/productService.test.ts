import { describe, it, expect, vi, beforeEach } from 'vitest';

const sampleProducts = [
  {
    id: 1,
    title: 'Product One',
    description: 'First product',
    price: 10,
    discountPercentage: 0,
    rating: 4.5,
    stock: 5,
    brand: 'BrandA',
    category: 'category-a',
    thumbnail: '',
    images: [],
    reviews: [],
  },
  {
    id: 2,
    title: 'Second Product',
    description: 'Another item',
    price: 20,
    discountPercentage: 0,
    rating: 4.0,
    stock: 3,
    brand: 'BrandB',
    category: 'category-b',
    thumbnail: '',
    images: [],
    reviews: [],
  },
];

describe('productService (minimal)', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('getProducts should fetch and cache results', async () => {
    const api = await import('../services/apiService');
    vi.spyOn(api, 'apiFetch').mockResolvedValue({ products: sampleProducts, total: 2, skip: 0, limit: 30 });

    const svc = await import('../services/productService');
    const res = await svc.getProducts();
    expect(res).toEqual(sampleProducts);

    // calling again should not trigger a second fetch
    await svc.getProducts();
    expect(api.apiFetch).toHaveBeenCalledTimes(1);
  });

  it('getProductsById should return item from cache when present', async () => {
    const api = await import('../services/apiService');
    vi.spyOn(api, 'apiFetch').mockResolvedValue({ products: sampleProducts, total: 2, skip: 0, limit: 30 });

    const svc = await import('../services/productService');
    await svc.getProducts(); // populate cache

    const item = await svc.getProductsById(2);
    expect(item).toEqual(sampleProducts[1]);
    // no additional apiFetch for getProductsById when in cache
    expect(api.apiFetch).toHaveBeenCalledTimes(1);
  });

  it('searchProducts should filter case-insensitive and return empty when no match', async () => {
    const api = await import('../services/apiService');
    vi.spyOn(api, 'apiFetch').mockResolvedValue({ products: sampleProducts, total: 2, skip: 0, limit: 30 });

    const svc = await import('../services/productService');
    const results = await svc.searchProducts('second');
    expect(results).toEqual([sampleProducts[1]]);

    const empty = await svc.searchProducts('nomatch');
    expect(empty).toEqual([]);
  });

  it('getProducts should propagate errors from apiFetch', async () => {
    const api = await import('../services/apiService');
    vi.spyOn(api, 'apiFetch').mockRejectedValue(new Error('network'));

    const svc = await import('../services/productService');
    await expect(svc.getProducts()).rejects.toThrow('network');
  });
});
