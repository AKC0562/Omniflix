import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ProfileSelectPage from './pages/ProfileSelectPage';
import BrowsePage from './pages/BrowsePage';
import SearchPage from './pages/SearchPage';
import MyListPage from './pages/MyListPage';
import AccountPage from './pages/AccountPage';
import AdminDashboard from './pages/AdminDashboard';

// Layout
import { ProtectedRoute, PublicRoute } from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Profile select (needs auth but no navbar) */}
        <Route
          path="/profiles"
          element={
            <RequireAuth>
              <ProfileSelectPage />
            </RequireAuth>
          }
        />

        {/* Protected routes (with navbar) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/browse/:category" element={<BrowsePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/my-list" element={<MyListPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>

        {/* Admin Dashboard (no regular navbar — has its own layout) */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
