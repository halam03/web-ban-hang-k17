import { createContext, useContext, useEffect, useState } from 'react';
import { addToCart, getCart, getCartTotal, saveCart, updateQuantity } from '../store/cart';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(getCart());

    useEffect(() => {
        saveCart(items);
    }, [items]);

    const addItem = (product, quantity = 1) => {
        setItems((prev) => addToCart([...prev], product, quantity));
    };

    const updateItem = (productId, quantity) => {
        setItems((prev) => updateQuantity(prev, productId, quantity));
    };

    const clear = () => setItems([]);

    const total = getCartTotal(items);

    return (
        <CartContext.Provider value={{ items, addItem, updateItem, clear, total }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
