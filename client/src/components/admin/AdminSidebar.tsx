// ===== Admin Sidebar =====
// Sleek sidebar navigation with glowing active state and Omnitrix theme
import { motion } from 'framer-motion';
import {
  FiGrid,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiShield,
} from 'react-icons/fi';

export type AdminView = 'dashboard' | 'users' | 'analytics' | 'settings';

interface AdminSidebarProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS: { id: AdminView; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <FiGrid size={20} /> },
  { id: 'users', label: 'Users', icon: <FiUsers size={20} /> },
  { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 size={20} /> },
  { id: 'settings', label: 'Settings', icon: <FiSettings size={20} /> },
];

export default function AdminSidebar({
  activeView,
  onViewChange,
  collapsed,
  onToggle,
}: AdminSidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col
                 bg-[#0a0a0a] border-r border-[#1a1a1a]"
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-[#1a1a1a]">
        <div className="relative flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.3)]">
          <FiShield size={18} className="text-black" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="overflow-hidden"
          >
            <h1 className="font-display text-sm tracking-[0.3em] text-white font-bold">
              OMNIFLIX
            </h1>
            <p className="text-[10px] text-[#00ff88]/60 tracking-wider font-display">
              ADMIN PANEL
            </p>
          </motion.div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 cursor-pointer group
                ${
                  isActive
                    ? 'bg-[#00ff88]/10 text-[#00ff88]'
                    : 'text-[#666] hover:text-white hover:bg-[#1a1a1a]/60'
                }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.5)]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <span className={`flex-shrink-0 transition-colors duration-300 ${isActive ? 'drop-shadow-[0_0_6px_rgba(0,255,136,0.5)]' : ''}`}>
                {item.icon}
              </span>

              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-body font-medium tracking-wide whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-3 pb-6">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[#555] hover:text-white hover:bg-[#1a1a1a]/60 transition-all duration-300 cursor-pointer"
        >
          {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          {!collapsed && (
            <span className="text-sm font-body">Collapse</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
