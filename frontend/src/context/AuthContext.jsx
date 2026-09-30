import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('civic_token') || null);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem('civic_user');
        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const fetchNotificationsCount = async () => {
        if (user && user.role === 'CITIZEN') {
            try {
                const list = await api.getNotifications();
                const unread = list.filter(n => n.is_read === 0).length;
                setUnreadCount(unread);
            } catch (e) {
                console.error(e);
            }
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotificationsCount();
        }
    }, [user]);

    const login = (userData, tokenStr) => {
        setUser(userData);
        setToken(tokenStr);
        localStorage.setItem('civic_user', JSON.stringify(userData));
        localStorage.setItem('civic_token', tokenStr);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('civic_user');
        localStorage.removeItem('civic_token');
    };

    const updateUserState = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('civic_user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            logout,
            updateUserState,
            unreadCount,
            fetchNotificationsCount
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
