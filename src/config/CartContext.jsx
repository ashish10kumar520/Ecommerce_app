import React, { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id || item.productId === product.id,
      );
      if (existing) {
        return prev.map((item) =>
          item.id === product.id || item.productId === product.id
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item,
        );
      }
      return [
        ...prev,
        {
          ...product,
          productId: product.productId ?? product.id,
          id: product.id,
          quantity: quantity,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== productId && item.productId !== productId),
    );
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      setCartItems((prev) =>
        prev.filter((item) => item.id !== productId && item.productId !== productId),
      );
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId || item.productId === productId
          ? { ...item, quantity }
          : item,
      ),
    );
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
