import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthGuard from './components/AuthGuard';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function Home() {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SmartFit AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-gray-200">
              Welcome, {user?.firstName} {user?.lastName}!
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Welcome to SmartFit AI! You have successfully registered and logged in.
          </p>
          <div className="flex gap-4">
            <a
              href="/profile"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              View Profile
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthGuard>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />

            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
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
