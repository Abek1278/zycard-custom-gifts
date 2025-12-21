import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/products';
import {
  CartItem,
  getCart,
  addToCart as addToCartLib,
  removeFromCart as removeFromCartLib,
  updateQuantity as updateQuantityLib,
  clearCart as clearCartLib,
  getCartTotal,
  getCartItemCount,
} from '@/lib/cart';
import { toast } from 'sonner';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    const newCart = addToCartLib(product, quantity);
    setCart([...newCart]);
    toast.success(`${product.name} added to cart!`, {
      description: `Quantity: ${quantity}`,
    });
  };

  const removeFromCart = (productId: string) => {
    const newCart = removeFromCartLib(productId);
    setCart([...newCart]);
    toast.info('Item removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const newCart = updateQuantityLib(productId, quantity);
    setCart([...newCart]);
  };

  const clearCart = () => {
    clearCartLib();
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total: getCartTotal(cart),
        itemCount: getCartItemCount(cart),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
