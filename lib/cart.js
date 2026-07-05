"use client";

const KEY = "olawood_cart";

export function getCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function save(cart) {
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((c) => c.product_id === item.product_id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  save(cart);
}

export function removeFromCart(productId) {
  save(getCart().filter((c) => c.product_id !== productId));
}

export function setQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find((c) => c.product_id === productId);
  if (item) item.quantity = Math.max(1, quantity);
  save(cart);
}

export function clearCart() {
  save([]);
}
