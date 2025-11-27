// src/context/CartContext.jsx  (replace the whole file content with this)
import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const calcUnitPrice = (cartItem) => {
  const basePrice = Number(
    cartItem.item?.discountedPrice ?? cartItem.item?.basePrice ?? 0
  );

  const variantPrice = Number(cartItem.selectedVariant?.price ?? basePrice);

  const addonsSum =
    (cartItem.addons || []).reduce((s, a) => s + Number(a?.price ?? 0), 0) || 0;

  return variantPrice + addonsSum;
};

export const CartProvider = ({ children }) => {
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) setCartItems(JSON.parse(storedCart));
    } catch (err) {
      console.error("Failed to parse stored cart:", err);
      setCartItems([]);
    }
    setIsCartLoaded(true); // ✔ important
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart:", err);
    }
  }, [cartItems]);

  // Add item to cart
  const addItem = (newItem) => {
    setCartItems((prev) => {
      // Normalize addon names for comparison
      const newAddonsNames = (newItem.addons || []).map((a) =>
        String(a?.name ?? "").trim()
      );

      const existingIndex = prev.findIndex((i) => {
        // match by same base item id
        if (String(i.itemId) !== String(newItem.itemId)) return false;

        // match by selected variant name (portion)
        const iVariant = String(i.selectedVariant?.name ?? "").trim();
        const newVariant = String(newItem.selectedVariant?.name ?? "").trim();
        if (iVariant !== newVariant) return false;

        // match by addons names (order-insensitive)
        const iAddons = (i.addons || []).map((a) =>
          String(a?.name ?? "").trim()
        );
        if (iAddons.length !== newAddonsNames.length) return false;

        const sortA = [...iAddons].sort();
        const sortB = [...newAddonsNames].sort();
        return sortA.every((v, idx) => v === sortB[idx]);
      });

      if (existingIndex !== -1) {
        // item already exists → increase quantity
        const updated = [...prev];
        const existing = updated[existingIndex];

        const unitPrice = calcUnitPrice(existing); // deterministic per-unit
        const combinedQuantity = existing.quantity + (newItem.quantity || 1);

        updated[existingIndex] = {
          ...existing,
          quantity: combinedQuantity,
          totalPrice: unitPrice * combinedQuantity,
        };
        return updated;
      }

      // New item → ensure numeric prices and shape, then push
      const sanitizedNewItem = {
        ...newItem,
        quantity: Number(newItem.quantity || 1),
        totalPrice: Number(newItem.totalPrice || 0),
        // keep other fields like item, itemId, name, selectedVariant, addons, isVeg etc.
      };

      return [...prev, sanitizedNewItem];
    });
  };

  // Remove item by index
  const removeItem = (index) =>
    setCartItems((prev) => prev.filter((_, i) => i !== index));

  // Clear entire cart
  const clearCart = () => setCartItems([]);

  // Increase quantity by index
  const increaseQuantity = (index) => {
    setCartItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const unit = calcUnitPrice(item);
        const newQty = Number(item.quantity || 1) + 1;
        return {
          ...item,
          quantity: newQty,
          totalPrice: unit * newQty,
        };
      })
    );
  };

  // Decrease quantity — if it reaches 0 → remove from cart
  const decreaseQuantity = (index) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      if (!item) return prev;

      const unit = calcUnitPrice(item);
      const newQty = Number(item.quantity || 1) - 1;

      if (newQty > 0) {
        updated[index] = {
          ...item,
          quantity: newQty,
          totalPrice: unit * newQty,
        };
        return updated;
      }
      // remove if 0 or less
      return updated.filter((_, i) => i !== index);
    });
  };

  // Calculate total dynamically
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.totalPrice || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
        total,
        isCartLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
