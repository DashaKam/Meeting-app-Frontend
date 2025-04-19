import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  fetchUserProfile,
  loginUser,
  refreshToken,
  registerUser,
  setAuthHeader
} from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const loadUserProfile = async (token) => {
    if (!token) return;
    try {
      console.log('AuthProvider: Fetching user data via service...');
      setAuthHeader(token);
      const data = await fetchUserProfile();
      setUserData(data);
      console.log('AuthProvider: User data fetched successfully via service.');
    } catch (error) {
      console.error('AuthProvider: Error fetching user data via service:', error);
      await logout();
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      let storedAccessToken = null;
      try {
        const storedRefreshToken = await AsyncStorage.getItem('refresh_token');
        storedAccessToken = await AsyncStorage.getItem('access_token');

        if (storedRefreshToken) {
          console.log('AuthProvider: Refresh token found, attempting refresh via service...');
          try {
            const refreshData = await refreshToken(storedRefreshToken);
            const newAccessToken = refreshData.access_token;
            await AsyncStorage.setItem('access_token', newAccessToken);
            setAccessToken(newAccessToken);
            await loadUserProfile(newAccessToken);
            console.log('AuthProvider: Token refresh successful via service.');
          } catch (refreshError) {
            console.error('AuthProvider: Refresh token failed via service:', refreshError);
            await logout();
          }
        } else if (storedAccessToken) {
          console.log('AuthProvider: Access token found (no refresh token), verifying via service...');
          setAccessToken(storedAccessToken);
          await loadUserProfile(storedAccessToken);
        } else {
          console.log('AuthProvider: No tokens found.');
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

  const login = async (username, password) => {
    try {
      console.log('AuthProvider: Attempting login via service...');
      const data = await loginUser(username, password);
      const { access_token, refresh_token } = data;

      await AsyncStorage.setItem('access_token', access_token);
      await AsyncStorage.setItem('refresh_token', refresh_token);
      setAccessToken(access_token);
      await loadUserProfile(access_token);
      console.log('AuthProvider: Login successful via service.');
      return true;
    } catch (error) {
      console.error('AuthProvider: Login failed via service:', error);
      await logout();
      return false;
    }
  };

  const register = async (name, username, email, password) => {
    try {
      console.log('AuthProvider: Attempting registration via service...');
      const data = await registerUser(name, username, email, password);
      const { access_token, refresh_token } = data;

      await AsyncStorage.setItem('access_token', access_token);
      await AsyncStorage.setItem('refresh_token', refresh_token);
      setAccessToken(access_token);
      await loadUserProfile(access_token);
      console.log('AuthProvider: Registration successful via service.');
      return true;
    } catch (error) {
      console.error('AuthProvider: Registration failed via service:', error);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE4C4',
  },
});