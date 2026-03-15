import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { getAlienAvatarInfo, getAlienInitials } from '../../data/alienAvatars';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, activeProfile, logout } = useAuthStore();
  const { searchQuery, setSearchQuery, isSearchOpen, toggleSearch } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const avatarInfo = activeProfile ? getAlienAvatarInfo(activeProfile.avatar) : null;
  const navLinks = [
    { to: '/browse', label: 'Home' },
    { to: '/browse/tv', label: 'TV Shows' },
    { to: '/browse/movies', label: 'Movies' },
    { to: '/my-list', label: 'My List' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-surface-dark/95 backdrop-blur-xl shadow-lg shadow-omnitrix-green/5'
          : 'bg-gradient-to-b from-surface-dark/80 to-transparent'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-[68px]">
        {/* Logo */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link to="/browse" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-omnitrix-green/20 border border-omnitrix-green/40 flex items-center justify-center animate-omnitrix-glow">
              <span className="text-omnitrix-green font-display font-bold text-sm">O</span>
            </div>
            <span className="font-display font-bold text-lg md:text-xl tracking-wider text-omnitrix-green text-glow-green">
              OMNIFLIX
            </span>
          </Link>

          {/* Nav links - desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-md text-sm font-body font-medium transition-all duration-300 ${
                  location.pathname === link.to
                    ? 'text-omnitrix-green bg-omnitrix-green/10'
                    : 'text-text-secondary hover:text-omnitrix-glow hover:bg-omnitrix-green/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <AnimatePresence>
            {isSearchOpen ? (
              <motion.form
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSearchSubmit}
                className="relative overflow-hidden"
              >
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titles, people, genres..."
                  className="w-full bg-surface-card/80 border border-omnitrix-green/30 text-text-primary text-sm rounded-lg px-4 py-2 pr-9 placeholder:text-text-muted focus:outline-none focus:border-omnitrix-green focus:ring-1 focus:ring-omnitrix-green/30 font-body"
                />
                <button type="button" onClick={toggleSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-omnitrix-green">
                  <FiX size={16} />
                </button>
              </motion.form>
            ) : (
              <button onClick={toggleSearch} className="p-2 text-text-secondary hover:text-omnitrix-green transition-colors" aria-label="Search">
                <FiSearch size={20} />
              </button>
            )}
          </AnimatePresence>

          {/* Notifications */}
          <button className="p-2 text-text-secondary hover:text-omnitrix-green transition-colors relative hidden md:block" aria-label="Notifications">
            <FiBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-alien-orange rounded-full" />
          </button>

          {/* Profile menu */}
          {user && activeProfile && avatarInfo && (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 group"
              >
                <div
                  className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold font-display border transition-all group-hover:scale-105"
                  style={{
                    backgroundColor: avatarInfo.color + '30',
                    borderColor: avatarInfo.color + '60',
                    color: avatarInfo.color,
                    boxShadow: `0 0 12px ${avatarInfo.glowColor}`,
                  }}
                >
                  {avatarInfo.emoji}
                </div>
                <FiChevronDown
                  size={14}
                  className={`text-text-muted transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-56 glass rounded-xl overflow-hidden shadow-2xl"
                  >
                    <div className="p-3 border-b border-omnitrix-green/10">
                      <p className="text-sm font-medium text-text-primary">{activeProfile.name}</p>
                      <p className="text-xs text-text-muted">{avatarInfo.name}</p>
                    </div>

                    {user.profiles.filter(p => p._id !== activeProfile._id).map(profile => {
                      const info = getAlienAvatarInfo(profile.avatar);
                      return (
                        <button
                          key={profile._id}
                          onClick={() => {
                            useAuthStore.getState().setActiveProfile(profile);
                            setProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-omnitrix-green/5 transition-colors"
                        >
                          <div
                            className="w-7 h-7 rounded flex items-center justify-center text-xs"
                            style={{ backgroundColor: info.color + '25', color: info.color }}
                          >
                            {info.emoji}
                          </div>
                          <span className="text-sm text-text-secondary">{profile.name}</span>
                        </button>
                      );
                    })}

                    <div className="border-t border-omnitrix-green/10">
                      <Link
                        to="/profiles"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-3 py-2.5 text-sm text-text-secondary hover:bg-omnitrix-green/5 transition-colors"
                      >
                        Manage Profiles
                      </Link>
                      <Link
                        to="/account"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-3 py-2.5 text-sm text-text-secondary hover:bg-omnitrix-green/5 transition-colors"
                      >
                        Account
                      </Link>
                      <button
                        onClick={() => { logout(); navigate('/'); setProfileMenuOpen(false); }}
                        className="w-full text-left px-3 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile menu */}
          <button
            className="lg:hidden p-2 text-text-secondary hover:text-omnitrix-green"
            onClick={useUIStore.getState().toggleMobileMenu}
            aria-label="Menu"
          >
            <FiMenu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {useUIStore((s) => s.isMobileMenuOpen) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden glass-dark overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={useUIStore.getState().closeMobileMenu}
                  className={`px-3 py-2 rounded-lg text-sm font-body font-medium ${
                    location.pathname === link.to
                      ? 'text-omnitrix-green bg-omnitrix-green/10'
                      : 'text-text-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
