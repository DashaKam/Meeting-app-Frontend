import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);
    const [userData, setUserData] = useState(null);

    const api = axios.create({
        baseURL: 'http://185.157.214.169:8888',
    });

    // Function to set Authorization header
    const setAuthHeader = (token) => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete api.defaults.headers.common['Authorization'];
        }
    };

    // Fetch User Data
    const fetchUserData = async (token) => {
        if (!token) return;
        try {
            console.log('AuthProvider: Fetching user data...');
            setAuthHeader(token);
            const response = await api.get('/users/me');
            setUserData(response.data);
            console.log('AuthProvider: User data fetched successfully.');
        } catch (error) {
            console.error('AuthProvider: Error fetching user data:', error.response ? error.response.data : error.message);
            // If fetching user data fails with the current token, treat as unauthenticated
            await logout();
        }
    };

    // Check initial auth status on mount
    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsLoading(true);
            let storedAccessToken = null;
            try {
                const refreshToken = await AsyncStorage.getItem('refresh_token');
                storedAccessToken = await AsyncStorage.getItem('access_token');

                if (refreshToken) {
                    console.log('AuthProvider: Refresh token found, attempting refresh...');
                    try {
                        const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
                        const newAccessToken = response.data.access_token;
                        await AsyncStorage.setItem('access_token', newAccessToken);
                        setAccessToken(newAccessToken);
                        await fetchUserData(newAccessToken);
                        console.log('AuthProvider: Token refresh successful.');
                    } catch (refreshError) {
                        console.error('AuthProvider: Refresh token failed:', refreshError.response ? refreshError.response.data : refreshError.message);
                        // Clear tokens if refresh fails
                        await logout();
                    }
                } else if (storedAccessToken) {
                    console.log('AuthProvider: Access token found (no refresh token), verifying...');
                    // Verify existing access token by fetching user data
                    setAccessToken(storedAccessToken);
                    await fetchUserData(storedAccessToken);
                } else {
                    console.log('AuthProvider: No tokens found.');
                    // Ensure state is clean if no tokens
                    setAccessToken(null);
                    setUserData(null);
                    setAuthHeader(null);
                }
            } catch (error) {
                console.error('AuthProvider: Error checking auth status:', error);
                await logout();
            } finally {
                setIsLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    const login = async (phone_number, password) => {
        try {
            console.log('AuthProvider: Attempting login...');
            const response = await api.post('/auth/login', { phone_number, password });
            const { access_token, refresh_token } = response.data;
            await AsyncStorage.setItem('access_token', access_token);
            await AsyncStorage.setItem('refresh_token', refresh_token);
            setAccessToken(access_token);
            await fetchUserData(access_token);
            console.log('AuthProvider: Login successful.');
            return true;
        } catch (error) {
            console.error('AuthProvider: Login failed:', error.response ? error.response.data : error.message);
            await logout();
            return false;
        }
    };

    const register = async (name, phone_number, password) => {
        try {
            console.log('AuthProvider: Attempting registration...');
            const response = await api.post('/auth/register', { name, phone_number, password });
            const { access_token, refresh_token } = response.data;
            await AsyncStorage.setItem('access_token', access_token);
            await AsyncStorage.setItem('refresh_token', refresh_token);
            setAccessToken(access_token);
            await fetchUserData(access_token);
            console.log('AuthProvider: Registration successful.');
            return true;
        } catch (error) {
            console.error('AuthProvider: Registration failed:', error.response ? error.response.data : error.message);
            await logout();
            return false;
        }
    };


    const logout = async () => {
        console.log('AuthProvider: Logging out...');
        setAccessToken(null);
        setUserData(null);
        setAuthHeader(null);
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        console.log('AuthProvider: Logout complete.');
    };

    // Render loading indicator while checking auth status
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#645BAA" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ accessToken, userData, isLoading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFE4C4', // Match profile background?
    },
}); 