import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Add item to cart
  const addItem = (newItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i._id === newItem._id &&
          i.portion === newItem.portion &&
          JSON.stringify(i.beverages) === JSON.stringify(newItem.beverages) &&
          JSON.stringify(i.desserts) === JSON.stringify(newItem.desserts)
      );

      if (existingIndex !== -1) {
        // ✅ Item already exists → increase quantity instead of duplicating
        const updated = [...prev];
        const existing = updated[existingIndex];
        const unitPrice = existing.totalPrice / existing.quantity;

        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + newItem.quantity,
          totalPrice: unitPrice * (existing.quantity + newItem.quantity),
        };
        return updated;
      }

      // ✅ New item → add to cart
      return [...prev, newItem];
    });
  };

  // ✅ Remove item by index
  const removeItem = (index) =>
    setCartItems((prev) => prev.filter((_, i) => i !== index));

  // ✅ Clear entire cart
  const clearCart = () => setCartItems([]);

  // ✅ Increase quantity
  const increaseQuantity = (index) => {
    setCartItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice:
                (item.totalPrice / item.quantity) * (item.quantity + 1),
            }
          : item
      )
    );
  };

  // ✅ Decrease quantity — if it reaches 1 → remove from cart
  const decreaseQuantity = (index) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const item = updated[index];

      if (item.quantity > 1) {
        const unitPrice = item.totalPrice / item.quantity;
        updated[index] = {
          ...item,
          quantity: item.quantity - 1,
          totalPrice: unitPrice * (item.quantity - 1),
        };
        return updated;
      }

      // If quantity is 1, remove it entirely
      return updated.filter((_, i) => i !== index);
    });
  };

  // ✅ Calculate total dynamically
  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
