const CART_KEY = 'camera_cart';

export const getCart = () => {
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const saveCart = (items) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const addToCart = (items, product, quantity = 1) => {
    const existing = items.find((item) => item.product.ma_sp === product.ma_sp);
    if (existing) {
        existing.quantity += quantity;
    } else {
        items.push({ product, quantity });
    }
    return [...items];
};

export const updateQuantity = (items, productId, quantity) => {
    return items.map((item) =>
        item.product.ma_sp === productId ? { ...item, quantity } : item
    );
};

export const removeAll = () => [];

export const getCartTotal = (items) =>
    items.reduce((sum, item) => sum + (item.product.gia_lon_nhat || 0) * item.quantity, 0);
