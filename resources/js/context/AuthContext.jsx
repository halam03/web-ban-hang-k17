import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/auth/me')
            .then((res) => setUser(res.data.user))
            .finally(() => setLoading(false));
    }, []);

    const login = async (payload) => {
        const res = await api.post('/auth/login', payload);
        setUser(res.data.user);
        return res.data.user;
    };

    const register = async (payload) => {
        const res = await api.post('/auth/register', payload);
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
