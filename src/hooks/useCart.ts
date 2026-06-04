import { useMemo, useSyncExternalStore } from "react";
import type { CartItem, CartState } from "@/types/cart.types";
import type { Product } from "@/types/product.types";

const CART_STORAGE_KEY = "devmarket:cart";
const CART_CHANGE_EVENT = "devmarket:cart-change";
const EMPTY_CART: CartState = { items: [] };

function isBrowser() {
  return typeof window !== "undefined";
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;

  const item = value as CartItem;

  return (
    typeof item.quantity === "number" &&
    item.quantity > 0 &&
    !!item.product &&
    typeof item.product.id === "number" &&
    typeof item.product.title === "string" &&
    typeof item.product.thumbnail === "string" &&
    typeof item.product.price === "number" &&
    typeof item.product.discountPercentage === "number" &&
    typeof item.product.stock === "number"
  );
}

function parseCartState(value: string | null): CartState {
  if (!value) return EMPTY_CART;

  try {
    const parsed = JSON.parse(value) as CartState;

    if (!Array.isArray(parsed.items)) {
      return EMPTY_CART;
    }

    return {
      items: parsed.items.filter(isCartItem),
    };
  } catch {
    return EMPTY_CART;
  }
}

function readCartState(): CartState {
  if (!isBrowser()) return EMPTY_CART;

  return parseCartState(window.localStorage.getItem(CART_STORAGE_KEY));
}

function writeCartState(state: CartState) {
  if (!isBrowser()) return;

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

function getCartSnapshot() {
  return JSON.stringify(readCartState());
}

function subscribeToCartChanges(onChange: () => void) {
  if (!isBrowser()) return () => undefined;

  const onStorageChange = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY) {
      onChange();
    }
  };

  window.addEventListener(CART_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorageChange);

  return () => {
    window.removeEventListener(CART_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorageChange);
  };
}

function upsertCartItem(items: CartItem[], product: Product, quantity: number) {
  const nextQuantity = Math.max(1, quantity);
  const currentItem = items.find((item) => item.product.id === product.id);

  if (!currentItem) {
    const clampedQuantity = Math.min(product.stock, nextQuantity);
    if (clampedQuantity <= 0) return items;
    return [...items, { product, quantity: clampedQuantity }];
  }

  return items.map((item) =>
    item.product.id === product.id
      ? {
          ...item,
          product,
          quantity: Math.min(product.stock, item.quantity + nextQuantity),
        }
      : item,
  );
}

function setCartItemQuantity(
  items: CartItem[],
  productId: number,
  quantity: number,
) {
  if (quantity <= 0) {
    return items.filter((item) => item.product.id !== productId);
  }

  return items.map((item) =>
    item.product.id === productId
      ? {
          ...item,
          quantity: Math.min(item.product.stock, quantity),
        }
      : item,
  );
}

export default function useCart() {
  const snapshot = useSyncExternalStore(
    subscribeToCartChanges,
    getCartSnapshot,
    () => JSON.stringify(EMPTY_CART),
  );
  const state = useMemo(() => parseCartState(snapshot), [snapshot]);

  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = state.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const addItem = (product: Product, quantity = 1) => {
    const currentState = readCartState();
    writeCartState({
      items: upsertCartItem(currentState.items, product, quantity),
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const currentState = readCartState();
    writeCartState({
      items: setCartItemQuantity(currentState.items, productId, quantity),
    });
  };

  const removeItem = (productId: number) => {
    const currentState = readCartState();
    writeCartState({
      items: currentState.items.filter((item) => item.product.id !== productId),
    });
  };

  const clearCart = () => {
    writeCartState(EMPTY_CART);
  };

  return {
    items: state.items,
    itemCount,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}