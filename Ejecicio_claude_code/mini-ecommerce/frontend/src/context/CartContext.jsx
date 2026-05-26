import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: '0.00' });
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    try {
      const response = await client.get('/carrito');
      setCart(response.data);
    } catch (err) {
      console.error('Error al obtener el carrito:', err);
      setCart({ items: [], total: '0.00' });
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [], total: '0.00' });
    }
  }, [user, fetchCart]);

  const addToCart = useCallback(async (producto_id, cantidad = 1) => {
    const response = await client.post('/carrito', { producto_id, cantidad });
    await fetchCart();
    return response.data;
  }, [fetchCart]);

  const updateItem = useCallback(async (id, cantidad) => {
    const response = await client.put(`/carrito/${id}`, { cantidad });
    await fetchCart();
    return response.data;
  }, [fetchCart]);

  const removeItem = useCallback(async (id) => {
    await client.delete(`/carrito/${id}`);
    await fetchCart();
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    await client.delete('/carrito');
    setCart({ items: [], total: '0.00' });
  }, []);

  const cartCount = cart.items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export default CartContext;
