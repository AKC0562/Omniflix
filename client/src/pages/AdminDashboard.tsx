// ===== Admin Dashboard Page =====
// Premium Netflix + Stripe-inspired admin dashboard with full user management
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAdminStore } from '../store/adminStore';
import AdminSidebar, { type AdminView } from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import StatsCards from '../components/admin/StatsCards';
import UsersTable from '../components/admin/UsersTable';
import Toast from '../components/admin/Toast';
import {
  FiBarChart2,
  FiSettings,
  FiTrendingUp,
  FiClock,
  FiActivity,
} from 'react-icons/fi';

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const {
    stats,
    isLoadingStats,
    error,
    successMessage,
    fetchStats,
    clearMessages,
  } = useAdminStore();

  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 72 : 260;

  // Redirect non-admins
  if (!user || user.role !== 'admin') {
    return <Navigate to="/browse" replace />;
  }

  // Load stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-clear messages
  const handleClearMessages = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  // Render active view content
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView stats={stats} isLoading={isLoadingStats} />;
      case 'users':
        return <UsersView />;
      case 'analytics':
        return <AnalyticsView stats={stats} />;
      case 'settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Sidebar */}
      <AdminSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Top Navbar */}
      <AdminNavbar sidebarWidth={sidebarWidth} />

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="pt-16 min-h-screen"
      >
        <div className="p-6 md:p-8 lg:p-10">
          {renderContent()}
        </div>
      </motion.main>

      {/* Toast Notifications */}
      {successMessage && (
        <Toast
          message={successMessage}
          type="success"
          onClose={handleClearMessages}
        />
      )}
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={handleClearMessages}
        />
      )}
    </div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────
function DashboardView({
  stats,
  isLoading,
}: {
  stats: ReturnType<typeof useAdminStore.getState>['stats'];
  isLoading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-wider">
          COMMAND CENTER
        </h1>
        <p className="text-sm text-[#555] font-body mt-2">
          Welcome back. Here's what's happening with OmniFlix today.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} isLoading={isLoading} />

      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Monthly Growth Chart placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-[#1a1a1a]/80 border border-[#2a2a2a] p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#00ff88]/10 flex items-center justify-center text-[#00ff88]">
              <FiTrendingUp size={18} />
            </div>
            <div>
              <h3 className="text-sm font-display text-white tracking-wider">
                USER GROWTH
              </h3>
              <p className="text-xs text-[#555] font-body">Last 6 months</p>
            </div>
          </div>

          {/* Simple bar chart */}
          {stats?.usersByMonth && stats.usersByMonth.length > 0 ? (
            <div className="flex items-end gap-3 h-40">
              {stats.usersByMonth.map((entry, i) => {
                const maxCount = Math.max(
                  ...stats.usersByMonth.map((e) => e.count),
                  1
                );
                const height = (entry.count / maxCount) * 100;
                return (
                  <div
                    key={entry.month}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <span className="text-[10px] text-[#00ff88] font-display">
                      {entry.count}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(height, 8)}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#00ff88]/30 to-[#00ff88]/60 min-h-[4px]
                                 hover:from-[#00ff88]/40 hover:to-[#00ff88]/80 transition-all duration-300 cursor-default"
                    />
                    <span className="text-[10px] text-[#555] font-body">
                      {entry.month.split('-')[1]}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-[#444] font-body text-sm">
              <FiActivity size={20} className="mr-2" />
              No growth data yet
            </div>
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-[#1a1a1a]/80 border border-[#2a2a2a] p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#00e5ff]/10 flex items-center justify-center text-[#00e5ff]">
              <FiClock size={18} />
            </div>
            <div>
              <h3 className="text-sm font-display text-white tracking-wider">
                QUICK STATS
              </h3>
              <p className="text-xs text-[#555] font-body">Platform overview</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                label: 'New users (30 days)',
                value: stats?.recentUsers ?? '—',
                color: '#00ff88',
              },
              {
                label: 'Total admins',
                value: stats?.totalAdmins ?? '—',
                color: '#a855f7',
              },
              {
                label: 'Avg profiles/user',
                value:
                  stats && stats.totalUsers > 0
                    ? (stats.totalProfiles / stats.totalUsers).toFixed(1)
                    : '—',
                color: '#ff6d00',
              },
              {
                label: 'Total profiles',
                value: stats?.totalProfiles ?? '—',
                color: '#00e5ff',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0"
              >
                <span className="text-sm text-[#888] font-body">
                  {item.label}
                </span>
                <span
                  className="text-lg font-display font-bold"
                  style={{ color: item.color }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Users View ───────────────────────────────────────────────
function UsersView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-wider">
          USER MANAGEMENT
        </h1>
        <p className="text-sm text-[#555] font-body mt-2">
          Manage all registered users, roles, and access.
        </p>
      </div>
      <UsersTable />
    </motion.div>
  );
}

// ─── Analytics View (placeholder) ─────────────────────────────
function AnalyticsView({
  stats,
}: {
  stats: ReturnType<typeof useAdminStore.getState>['stats'];
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-wider">
          ANALYTICS
        </h1>
        <p className="text-sm text-[#555] font-body mt-2">
          Platform analytics and insights.
        </p>
      </div>

      <div className="rounded-2xl bg-[#1a1a1a]/80 border border-[#2a2a2a] p-12 backdrop-blur-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center mx-auto mb-6">
          <FiBarChart2 size={28} className="text-[#00ff88]" />
        </div>
        <h3 className="text-lg font-display text-white tracking-wider mb-3">
          COMING SOON
        </h3>
        <p className="text-sm text-[#555] font-body max-w-md mx-auto leading-relaxed">
          Detailed analytics including watch time, popular content, user engagement
          metrics, and retention analysis will be available here.
        </p>

        {/* Quick stats preview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-[#2a2a2a]">
            {[
              { label: 'Users', value: stats.totalUsers, color: '#00ff88' },
              { label: 'Profiles', value: stats.totalProfiles, color: '#00e5ff' },
              { label: 'Admins', value: stats.totalAdmins, color: '#a855f7' },
              { label: 'New (30d)', value: stats.recentUsers, color: '#ff6d00' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p
                  className="text-2xl font-display font-bold"
                  style={{ color: item.color }}
                >
                  {item.value}
                </p>
                <p className="text-xs text-[#555] font-body mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Settings View (placeholder) ──────────────────────────────
function SettingsView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-wider">
          SETTINGS
        </h1>
        <p className="text-sm text-[#555] font-body mt-2">
          Platform configuration and preferences.
        </p>
      </div>

      <div className="rounded-2xl bg-[#1a1a1a]/80 border border-[#2a2a2a] p-12 backdrop-blur-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#ff6d00]/10 border border-[#ff6d00]/20 flex items-center justify-center mx-auto mb-6">
          <FiSettings size={28} className="text-[#ff6d00]" />
        </div>
        <h3 className="text-lg font-display text-white tracking-wider mb-3">
          COMING SOON
        </h3>
        <p className="text-sm text-[#555] font-body max-w-md mx-auto leading-relaxed">
          Platform settings including API key management, security configurations,
          email templates, and system preferences will be available here.
        </p>
      </div>
    </motion.div>
  );
}
