import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { getAlienAvatarInfo } from '../../data/alienAvatars';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, activeProfile, logout } = useAuthStore();
  const { toggleSearch } = useUIStore(); // We could add search bar right in nav
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const avatarInfo = activeProfile ? getAlienAvatarInfo(activeProfile.avatar) : null;
  const navLinks = [
    { to: '/browse', label: 'Home' },
    { to: '/browse/tv', label: 'TV Shows' },
    { to: '/browse/movies', label: 'Movies' },
    { to: '/my-list', label: 'My List' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full border-b border-transparent ${
        scrolled
          ? 'bg-black/60 backdrop-blur-xl border-white/5 shadow-[0_0_20px_rgba(142,255,113,0.1)]'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      } flex justify-between items-center px-4 md:px-8 py-4`}
    >
      <div className="flex items-center gap-6 md:gap-12 w-full md:w-auto">
        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-on-surface-variant hover:text-primary transition-colors"
          onClick={useUIStore.getState().toggleMobileMenu}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <Link to="/browse" className="shrink-0 flex items-center">
          <span className="text-2xl font-black text-primary tracking-tighter uppercase font-headline">Omniflix</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex gap-8 items-center">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`font-headline tracking-tight transition-colors transition-transform duration-200 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'text-primary border-b-2 border-primary pb-1 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:scale-105'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden lg:block group">
           <Link to="/search" className="flex items-center group/search-link">
             <span className="material-symbols-outlined text-on-surface-variant group-hover/search-link:text-primary transition-colors">search</span>
           </Link>
        </div>
        <Link to="/search" className="lg:hidden text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">search</span>
        </Link>

        {/* Profile Section */}
        {user && activeProfile && avatarInfo && (
          <div className="flex items-center gap-4 relative" ref={profileMenuRef}>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer hidden md:block">
              notifications
            </span>
            <button
               onClick={() => setProfileMenuOpen(!profileMenuOpen)}
               className="flex items-center gap-2 group cursor-pointer"
            >
               <span className="material-symbols-outlined text-on-surface-variant transition-colors group-hover:text-primary hidden md:block">account_circle</span>
               <div className="w-10 h-10 rounded-full border border-primary/30 overflow-hidden flex flex-col justify-end bg-surface-container-high transition-all group-hover:shadow-[0_0_15px_rgba(142,255,113,0.3)]">
                 <div
                    className="w-full h-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: avatarInfo.color + '20', color: avatarInfo.color }}
                 >
                    {avatarInfo.emoji}
                 </div>
               </div>
            </button>

            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 top-14 w-64 bg-surface-container-high/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="p-4 border-b border-white/5 bg-surface-container/50">
                    <p className="text-sm font-bold text-on-surface font-headline">{activeProfile.name}</p>
                    <p className="text-xs text-primary font-headline tracking-widest uppercase">{avatarInfo.name}</p>
                  </div>

                  <div className="p-2 border-b border-white/5 space-y-1">
                    {user.profiles.filter(p => p._id !== activeProfile._id).map(profile => {
                      const info = getAlienAvatarInfo(profile.avatar);
                      return (
                        <button
                          key={profile._id}
                          onClick={() => {
                            useAuthStore.getState().setActiveProfile(profile);
                            setProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-primary/10 rounded-lg transition-colors group"
                        >
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center text-lg shadow-sm"
                            style={{ backgroundColor: info.color + '20', color: info.color }}
                          >
                            {info.emoji}
                          </div>
                          <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface">{profile.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2 space-y-1">
                    <Link
                      to="/profiles"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-label text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">group</span>
                      Manage Profiles
                    </Link>
                    <Link
                      to="/account"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-label text-on-surface-variant hover:text-on-surface hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                      Account Settings
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-label text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                        Admin Dashboard
                      </Link>
                    )}
                  </div>
                  <div className="p-2 bg-error/5 border-t border-error/10 text-center">
                    <button
                      onClick={() => { logout(); navigate('/'); setProfileMenuOpen(false); }}
                      className="w-full text-center px-3 py-2.5 text-xs font-bold font-headline tracking-widest uppercase text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {useUIStore((s) => s.isMobileMenuOpen) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 right-0 bg-surface-container-high/95 backdrop-blur-xl border-b border-white/5 lg:hidden overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={useUIStore.getState().closeMobileMenu}
                  className={`px-4 py-3 rounded-xl text-sm font-headline font-bold ${
                    location.pathname === link.to
                      ? 'text-primary bg-primary/10'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
