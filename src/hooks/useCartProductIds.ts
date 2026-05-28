import { useEffect, useState } from "react";

import type { CartItem, CartState } from "@/types/cart.types";

const CART_STORAGE_KEYS = ["cart", "devmarket-cart", "devmarket:cart"];

function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "product" in value &&
    typeof (value as CartItem).product?.id === "number"
  );
}

function extractIds(value: unknown): number[] {
  if (Array.isArray(value)) {
    return value.filter(isCartItem).map((item) => item.product.id);
  }

  const maybeCart = value as Partial<CartState> | null;

  if (Array.isArray(maybeCart?.items)) {
    return maybeCart.items.filter(isCartItem).map((item) => item.product.id);
  }

  return [];
}

export function useCartProductIds(): number[] {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const nextIds = CART_STORAGE_KEYS.flatMap((key) => {
      const rawCart = window.localStorage.getItem(key);

      if (!rawCart) {
        return [];
      }

      try {
        return extractIds(JSON.parse(rawCart));
      } catch {
        return [];
      }
    });

    setIds([...new Set(nextIds)]);
  }, []);

  return ids;
}
