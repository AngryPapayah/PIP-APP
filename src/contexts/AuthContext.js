import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
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
                console.error("Failed to load user from storage", e);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (userData) => {
        try {
            setUser(userData);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
            console.error("Failed to save user to storage", e);
        }
    };

    const logout = async () => {
        try {
            setUser(null);
            await AsyncStorage.removeItem('user');
        } catch (e) {
            console.error("Failed to remove user from storage", e);
        }
    };

    //onboarding
    const updateUser = async (updatedFields) => {
        try {
            setUser((prevUser) => {
                if (!prevUser) return null;

                const newUser = {...prevUser, ...updatedFields};
                AsyncStorage.setItem('user', JSON.stringify(newUser)).catch(err =>
                    console.error("Failed to sync updated user to AsyncStorage", err)
                );

                return newUser;
            });
        } catch (e) {
            console.error("Failed to update user state", e);
        }
    };


    return (
        <AuthContext.Provider value={{user, login, logout, loading, updateUser}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);