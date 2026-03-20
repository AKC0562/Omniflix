// ===== Admin Top Navbar =====
// Clean top navigation bar with user info and logout
import { motion } from 'framer-motion';
import { FiLogOut, FiBell, FiSearch } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface AdminNavbarProps {
  sidebarWidth: number;
}

export default function AdminNavbar({ sidebarWidth }: AdminNavbarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      initial={false}
      animate={{ marginLeft: sidebarWidth }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 right-0 z-40 h-16 flex items-center justify-between px-8
                 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#1a1a1a]"
      style={{ left: sidebarWidth }}
    >
      {/* Left — Page context */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-[#555]">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
          <span className="text-xs font-display tracking-widest">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Right — User info & actions */}
      <div className="flex items-center gap-4">
        {/* Return to App */}
        <button
          onClick={() => navigate('/browse')}
          className="text-sm font-body text-[#00ff88] hover:text-[#00cc6a] transition-colors duration-300 mr-2 border border-[#00ff88]/30 px-3 py-1.5 rounded-lg hover:bg-[#00ff88]/10"
        >
          Return to App
        </button>

        {/* Notifications (placeholder) */}
        <button className="relative p-2 rounded-xl text-[#555] hover:text-white hover:bg-[#1a1a1a] transition-all duration-300 cursor-pointer">
          <FiBell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00ff88] rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-[#1a1a1a]" />

        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-white font-body font-medium leading-tight">
              {user?.username || 'Admin'}
            </p>
            <p className="text-[10px] text-[#00ff88]/60 font-display tracking-wider">
              ADMINISTRATOR
            </p>
          </div>
          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00ff88]/30 to-[#00cc6a]/10 border border-[#00ff88]/20 flex items-center justify-center text-[#00ff88] text-sm font-display font-bold">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="p-2.5 rounded-xl text-[#555] hover:text-[#ff4444] hover:bg-[#ff4444]/10
                     transition-all duration-300 cursor-pointer"
          title="Logout"
        >
          <FiLogOut size={18} />
        </motion.button>
      </div>
    </motion.header>
  );
}
