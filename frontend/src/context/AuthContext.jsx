import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    // Check if token valid
                    jwtDecode(token);
                    const res = await api.get('auth/me/');
                    setUser(res.data);
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    setUser(null);
                }
            }
            setLoading(false);
        }
        checkUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('auth/login/', { email, password });
        const { access, refresh } = res.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        const me = await api.get('auth/me/');
        setUser(me.data);
        return me.data;
    };

    const register = async (data) => {
        await api.post('auth/register/', data);
        await login(data.email, data.password);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const res = await api.get('auth/me/');
            setUser(res.data);
        } catch (error) {
            console.error("Failed to refresh user", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
