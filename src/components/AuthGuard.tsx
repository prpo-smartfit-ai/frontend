import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isTokenExpired } from '../utils/jwt';

// authguard checks token on mount and every minute
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      logout();
      return;
    }

    // check if token is expired
    if (isTokenExpired(token)) {
      console.warn('Token expired, logging out...');
      logout();
      return;
    }

    // set up periodic check for token expiration (every minute)
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('authToken');
      if (currentToken && isTokenExpired(currentToken)) {
        console.warn('Token expired, logging out...');
        logout();
      }
    }, 60000); // check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated, logout]);

  return <>{children}</>;
}
