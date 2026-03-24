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
import ActorPage from './pages/ActorPage';

// Error Pages
import { NotFoundPage, ErrorPage } from './pages/errors';

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
          <Route path="/actor/:id" element={<ActorPage />} />
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

        {/* Error pages */}
        <Route path="/error/400" element={<ErrorPage code={400} />} />
        <Route path="/error/401" element={<ErrorPage code={401} />} />
        <Route path="/error/403" element={<ErrorPage code={403} />} />
        <Route path="/error/408" element={<ErrorPage code={408} />} />
        <Route path="/error/429" element={<ErrorPage code={429} />} />
        <Route path="/error/500" element={<ErrorPage code={500} />} />
        <Route path="/error/502" element={<ErrorPage code={502} />} />
        <Route path="/error/503" element={<ErrorPage code={503} />} />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
