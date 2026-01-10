import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthGuard from './components/AuthGuard';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import HistoryPage from './pages/HistoryPage';
import HomePage from './pages/HomePage';

function PrivateRoute({ children, requireOnboarding = false }: { children: React.ReactNode, requireOnboarding?: boolean }) {
  const { isAuthenticated, isLoading, user, fetchUserProfile } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAuthenticated && user && requireOnboarding === false) {
      const checkOnboarding = async () => {
        try {
          const profile = await fetchUserProfile();
          if (!profile || !profile.age || !profile.height || !profile.currentWeight) {
            setNeedsOnboarding(true);
          } else {
            setNeedsOnboarding(false);
          }
        } catch (error) {
          // if profile fetch fails, assume onboarding is needed
          setNeedsOnboarding(true);
        }
      };
      checkOnboarding();
    } else {
      setNeedsOnboarding(false);
    }
  }, [isAuthenticated, user, fetchUserProfile, requireOnboarding]);

  if (isLoading || needsOnboarding === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (needsOnboarding) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <AuthGuard>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/onboarding" element={
              <PrivateRoute requireOnboarding={true}>
                <OnboardingPage />
              </PrivateRoute>
            } />

            <Route path="/home" element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            } />

            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />

            <Route path="/history" element={
              <PrivateRoute>
                <HistoryPage />
              </PrivateRoute>
            } />

            <Route path="/" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </AuthGuard>
    </AuthProvider>
  );
}

export default App;
