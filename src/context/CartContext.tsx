"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  cartItemId: string; // Unique ID for the cart line item (e.g. uuid or composite)
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  size?: string;
  flavor?: string;
  photoUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "cartItemId">) => void;
  removeItem: (cartItemId: string) => void;
  updateQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clearCart: () => {},
  total: 0,
  count: 0
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bellaria_cart_v2"); // New key to clear old incompatible cart
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("bellaria_cart_v2", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Omit<CartItem, "quantity" | "cartItemId">) => {
    setItems((prev) => {
      // Find if exact same product + configuration exists
      const existing = prev.find(
        (i) => i.productId === product.productId && 
               i.size === product.size && 
               i.flavor === product.flavor && 
               i.photoUrl === product.photoUrl
      );
      if (existing) {
        return prev.map((i) => i.cartItemId === existing.cartItemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      
      const cartItemId = crypto.randomUUID();
      return [...prev, { ...product, cartItemId, quantity: 1 }];
    });
  };

  const removeItem = (cartItemId: string) => setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));

  const updateQty = (cartItemId: string, qty: number) => {
    if (qty <= 0) return removeItem(cartItemId);
    setItems((prev) => prev.map((i) => i.cartItemId === cartItemId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
