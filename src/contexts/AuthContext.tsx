import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserProfile } from '../types';
import { userService } from '../api/userService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  fetchCurrentUser: () => Promise<void>;
  fetchUserProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token and user data
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await userService.login(email, password);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await userService.register(email, password, firstName, lastName);
      // store token and user from registration response
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await userService.getCurrentUser();
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      // token is invalid, logout
      logout();
    }
  };

  const fetchUserProfile = async (): Promise<UserProfile | null> => {
    try {
      const response = await userService.getUserProfile();
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        fetchCurrentUser,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
