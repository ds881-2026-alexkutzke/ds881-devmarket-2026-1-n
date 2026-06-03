// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import useCart from "../../hooks/useCart";
import type { Product } from "../../types/product.types";

const cartStorageKey = "devmarket:cart";

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: "Produto teste",
    description: "Descrição do produto",
    price: 100,
    discountPercentage: 10,
    rating: 4.5,
    stock: 3,
    brand: "Marca",
    category: "categoria",
    thumbnail: "https://example.com/product.png",
    images: [],
    reviews: [],
    sku: "SKU-1",
    dimensions: {
      width: 10,
      height: 10,
      depth: 10,
    },
    ...overrides,
  };
}

describe("useCart", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("persiste item adicionado respeitando o limite de estoque", () => {
    const product = createProduct({ stock: 2 });
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(product, 999);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(JSON.parse(window.localStorage.getItem(cartStorageKey) ?? "{}")).toEqual({
      items: [{ product, quantity: 2 }],
    });
  });

  it("remove item quando a quantidade é atualizada para zero", () => {
    const product = createProduct();
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(product);
      result.current.updateQuantity(product.id, 0);
    });

    expect(result.current.items).toEqual([]);
    expect(JSON.parse(window.localStorage.getItem(cartStorageKey) ?? "{}")).toEqual({
      items: [],
    });
  });

  it("ignora itens inválidos armazenados no localStorage", () => {
    window.localStorage.setItem(
      cartStorageKey,
      JSON.stringify({
        items: [
          {
            product: { id: 1 },
            quantity: 1,
          },
        ],
      }),
    );

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
  });

  it("sincroniza estado no mesmo documento ao alterar o carrinho", () => {
    const product = createProduct();
    const firstHook = renderHook(() => useCart());
    const secondHook = renderHook(() => useCart());

    act(() => {
      firstHook.result.current.addItem(product, 2);
    });

    expect(secondHook.result.current.items).toHaveLength(1);
    expect(secondHook.result.current.items[0].quantity).toBe(2);
  });
});
