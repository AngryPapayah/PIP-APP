import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeToken, storeToken, USE_JWT } from '../services/Fetch';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error("[AuthContext] Failed to load user session:", e);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (userData, token = null) => {
        try {
            setUser(userData);
            await AsyncStorage.setItem('user', JSON.stringify(userData));

            if (USE_JWT && token) {
                await storeToken(token);
            }
        } catch (e) {
            console.error("[AuthContext] Login persistence failed:", e);
        }
    };

    const updateUser = useCallback(async (updates) => {
        try {
            setUser((prevUser) => {
                if (!prevUser) return null;
                const updatedUser = { ...prevUser, ...updates };
                AsyncStorage.setItem('user', JSON.stringify(updatedUser)).catch(err =>
                    console.error("Failed to sync updated user to AsyncStorage", err)
                );
                return updatedUser;
            });
        } catch (e) {
            console.error("[AuthContext] Update user failed:", e);
        }
    }, []);

    const logout = async () => {
        try {
            setUser(null);
            await AsyncStorage.removeItem('user');

            if (USE_JWT) {
                await removeToken();
            }
        } catch (e) {
            console.error("[AuthContext] Logout failed:", e);
        }
    };

    return (
        <AuthContext.Provider value={{user, login, logout, loading, updateUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};