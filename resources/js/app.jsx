import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const App = () => (
    <AuthProvider>
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="shop" element={<Shop />} />
                        <Route path="product/:id" element={<ProductDetail />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="checkout" element={<Checkout />} />
                    </Route>
                    <Route element={<AuthLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                    </Route>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </CartProvider>
    </AuthProvider>
);

createRoot(document.getElementById('app')).render(<App />);
