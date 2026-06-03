import { useMemo, useSyncExternalStore } from "react";
import type { CartItem, CartState } from "@/types/cart.types";
import type { Product } from "@/types/product.types";
import { calculateDiscountedPrice } from "@/utils/calculateDiscountedPrice";

const CART_STORAGE_KEY = "devmarket:cart";
const CART_CHANGE_EVENT = "devmarket:cart-change";
const EMPTY_CART: CartState = { items: [] };

function isBrowser() {
  return typeof window !== "undefined";
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;

  const item = value as CartItem;
  const product = item.product;

  return (
    typeof item.quantity === "number" &&
    item.quantity > 0 &&
    !!product &&
    typeof product.id === "number" &&
    typeof product.title === "string" &&
    typeof product.thumbnail === "string" &&
    typeof product.price === "number" &&
    Number.isFinite(product.price) &&
    typeof product.discountPercentage === "number" &&
    Number.isFinite(product.discountPercentage) &&
    typeof product.stock === "number" &&
    Number.isFinite(product.stock)
  );
}

function clampQuantity(quantity: number, stock: number) {
  const stockLimit = Math.max(0, Math.floor(stock));

  if (stockLimit === 0) {
    return 0;
  }

  return Math.min(stockLimit, Math.max(1, Math.floor(quantity)));
}

function normalizeCartItem(item: CartItem): CartItem | null {
  const quantity = clampQuantity(item.quantity, item.product.stock);

  if (quantity === 0) {
    return null;
  }

  return {
    ...item,
    quantity,
  };
}

function parseCartState(value: string | null): CartState {
  if (!value) return EMPTY_CART;

  try {
    const parsed = JSON.parse(value) as CartState;

    if (!Array.isArray(parsed.items)) {
      return EMPTY_CART;
    }

    return {
      items: parsed.items
        .filter(isCartItem)
        .map(normalizeCartItem)
        .filter((item): item is CartItem => item !== null),
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
  const nextQuantity = clampQuantity(quantity, product.stock);
  const currentItem = items.find((item) => item.product.id === product.id);

  if (nextQuantity === 0) {
    return items;
  }

  if (!currentItem) {
    return [...items, { product, quantity: nextQuantity }];
  }

  return items.map((item) =>
    item.product.id === product.id
      ? {
          ...item,
          product,
          quantity: clampQuantity(item.quantity + nextQuantity, product.stock),
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

  return items
    .map((item) =>
      item.product.id === productId
        ? {
            ...item,
            quantity: clampQuantity(quantity, item.product.stock),
          }
        : item,
    )
    .filter((item) => item.quantity > 0);
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
    (total, item) =>
      total +
      calculateDiscountedPrice(
        item.product.price,
        item.product.discountPercentage,
      ) *
        item.quantity,
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
