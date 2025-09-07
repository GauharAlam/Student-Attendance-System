import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { loginUser as apiLogin } from '@/service/authService';
import axiosInstance from '@/config/axiosInstance';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>; // Return User or null
  logout: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ... (useEffect remains the same)

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiLogin({ email, password });
      if (response.success && response.token && response.user) {
        localStorage.setItem('token', response.token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        const userData = response.user as User;
        setUser(userData);
        return userData; // Return the full user object
      }
      return null; // Return null on failure
    } catch (error) {
      console.error('Login failed:', error);
      return null; // Return null on error
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    setIsLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};