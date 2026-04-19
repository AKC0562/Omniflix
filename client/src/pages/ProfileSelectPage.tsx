import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import { profileAPI } from '../services/api';
import { ALIEN_AVATARS, getAlienAvatarInfo } from '../data/alienAvatars';
import type { Profile, AlienAvatar } from '../types';

export default function ProfileSelectPage() {
  const { user, setActiveProfile, updateProfiles } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [transformingId, setTransformingId] = useState<string | null>(null);

  if (!user) return null;

  const handleSelectProfile = (profile: Profile) => {
    if (isEditing) return;
    setTransformingId(profile._id);
    // Play transformation animation then navigate
    setTimeout(() => {
      setActiveProfile(profile);
      navigate('/browse');
    }, 1100);
  };

  const handleDeleteProfile = async (profileId: string) => {
    try {
      const { data } = await profileAPI.deleteProfile(profileId);
      updateProfiles(data.profiles);
    } catch { }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Holographic Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(142, 255, 113, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(142, 255, 113, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial Green Glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(142, 255, 113, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* Transformation flash overlay */}
      <AnimatePresence>
        {transformingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.2, times: [0, 0.2, 0.8, 1] }}
            className="fixed inset-0 z-50 bg-omnitrix-green/50 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: [0, 1.5, 4, 15], rotate: [0, 180, 360, 540] }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full border-[12px] border-black flex items-center justify-center relative bg-omnitrix-green overflow-hidden"
            >
              {/* Hourglass inside transformation */}
              <div className="absolute inset-x-0 h-[120%] bg-black/90" style={{ clipPath: 'polygon(0 0, 100% 0, 60% 50%, 100% 100%, 0 100%, 40% 50%)' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Nav Bar */}
      <header className="w-full fixed top-0 left-0 z-40">
        <nav className="flex justify-between items-center w-full px-6 md:px-8 py-5 md:py-6 max-w-[1440px] mx-auto">
          <div
            className="text-xl md:text-2xl font-bold tracking-tighter uppercase font-headline"
            style={{
              color: '#a3e635',
              filter: 'drop-shadow(0 0 10px rgba(142,255,113,0.5))',
            }}
          >
            OMNITRIX CORE
          </div>
          <div className="hidden md:flex items-center gap-8 font-headline tracking-widest uppercase text-sm">
            <a href="#" className="text-zinc-500 hover:text-lime-200 transition-colors duration-300">Selection Core</a>
            <a href="#" className="text-zinc-500 hover:text-lime-200 transition-colors duration-300">DNA Vault</a>
            <a href="#" className="text-zinc-500 hover:text-lime-200 transition-colors duration-300">System Logs</a>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button className="hover:bg-zinc-800/40 hover:scale-105 transition-all duration-300 p-2 rounded-full active:scale-95">
              <span className="material-symbols-outlined" style={{ color: '#a3e635' }}>settings</span>
            </button>
            <button className="hover:bg-zinc-800/40 hover:scale-105 transition-all duration-300 p-2 rounded-full active:scale-95">
              <span className="material-symbols-outlined" style={{ color: '#a3e635' }}>security</span>
            </button>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-primary overflow-hidden bg-surface-container-high">
              <div className="w-full h-full flex items-center justify-center text-lg">
                {user.profiles[0] ? getAlienAvatarInfo(user.profiles[0].avatar).emoji : '👤'}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-24 pb-20 md:pb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl flex flex-col items-center justify-center"
        >
          {/* Title */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white uppercase">
              SELECT{' '}
              <span
                style={{
                  color: '#8eff71',
                  filter: 'drop-shadow(0 0 15px rgba(142, 255, 113, 0.4))',
                }}
              >
                DNA PROFILE
              </span>
            </h1>
            <p className="font-body text-on-surface-variant tracking-[0.2em] text-xs md:text-sm uppercase">
              Verification required for access to Holo-Stream archives
            </p>
          </div>

          {/* Profile Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 max-w-5xl mb-16 md:mb-20">
            {user.profiles.map((profile, i) => {
              const avatarInfo = getAlienAvatarInfo(profile.avatar);
              const isTransforming = transformingId === profile._id;

              return (
                <motion.div
                  key={profile._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="relative group flex flex-col items-center"
                >
                  <div className="relative">
                    <button
                      onClick={() => handleSelectProfile(profile)}
                      className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center outline-none"
                      disabled={transformingId !== null}
                      style={{ transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                      onMouseEnter={(e) => {
                        if (!transformingId) (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                      }}
                    >
                      {/* Outer Glow Ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full p-1"
                        style={{
                          background: `linear-gradient(135deg, ${avatarInfo.color}, #8eff71)`,
                          opacity: 0.9,
                        }}
                        animate={isTransforming ? {
                          boxShadow: `0 0 50px ${avatarInfo.color}`,
                          scale: 1.05,
                        } : {}}
                      >
                        {/* Inner Container */}
                        <div className="w-full h-full rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center relative"
                          style={{ border: '3px solid rgba(0,0,0,0.8)' }}
                        >
                          {/* Color Tint Background */}
                          <div
                            className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                            style={{ backgroundColor: avatarInfo.color }}
                          />

                          {/* Avatar Emoji */}
                          <motion.span
                            className="relative z-10 text-5xl sm:text-6xl md:text-7xl drop-shadow-2xl"
                            style={{ filter: 'grayscale(60%)' }}
                            animate={isTransforming
                              ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] }
                              : { scale: 1, opacity: 1 }
                            }
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.filter = 'grayscale(0%)';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.filter = 'grayscale(60%)';
                            }}
                          >
                            {avatarInfo.emoji}
                          </motion.span>

                          {/* Gradient Overlay on hover */}
                          <div
                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{
                              background: `linear-gradient(to top, ${avatarInfo.color}30, transparent)`,
                            }}
                          />
                        </div>
                      </motion.div>

                      {/* Hover Glow Ring */}
                      <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                        style={{
                          boxShadow: `0 0 40px rgba(142, 255, 113, 0.4)`,
                        }}
                      />

                      {/* Editing Overlay */}
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm z-20">
                          <FiEdit2 size={36} className="text-white" />
                        </div>
                      )}
                    </button>

                    {/* Delete Button (when editing) */}
                    {isEditing && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={(e) => { e.stopPropagation(); handleDeleteProfile(profile._id); }}
                        className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-10 h-10 rounded-full bg-red-600 border-[3px] border-black text-white flex items-center justify-center hover:bg-red-500 transition-colors z-30 shadow-lg"
                        disabled={user.profiles.length <= 1}
                      >
                        <FiTrash2 size={18} />
                      </motion.button>
                    )}
                  </div>

                  {/* Profile Name */}
                  <span className="mt-5 md:mt-6 text-zinc-300 group-hover:text-primary transition-colors duration-300 text-lg sm:text-xl md:text-2xl font-headline font-medium tracking-wide text-center">
                    {profile.name}
                  </span>
                </motion.div>
              );
            })}

            {/* Add Profile / Initialize DNA Button */}
            {user.profiles.length < 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: user.profiles.length * 0.1, duration: 0.5 }}
                className="relative group flex flex-col items-center"
              >
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full flex items-center justify-center outline-none transition-all duration-500"
                  style={{
                    border: '2px dashed #52525b',
                    background: 'rgba(25, 25, 25, 0.5)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = '#8eff71';
                    el.style.background = 'rgba(142, 255, 113, 0.1)';
                    el.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.borderColor = '#52525b';
                    el.style.background = 'rgba(25, 25, 25, 0.5)';
                    el.style.transform = 'scale(1)';
                  }}
                >
                  <span
                    className="material-symbols-outlined text-5xl text-zinc-500 group-hover:text-primary transition-all duration-500 group-hover:rotate-90"
                  >
                    add
                  </span>
                  {/* Outer expand ring on hover */}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 pointer-events-none"
                    style={{ border: '1px solid rgba(142, 255, 113, 0.5)' }}
                  />
                </button>
                <span className="mt-5 md:mt-6 text-zinc-500 group-hover:text-primary transition-colors duration-300 text-lg sm:text-xl md:text-2xl font-headline font-medium tracking-wide text-center">
                  INITIALIZE DNA
                </span>
              </motion.div>
            )}
          </div>

          {/* Manage Profiles Button */}
          <div className="mt-4 md:mt-8">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="group relative px-10 md:px-12 py-3 md:py-4 bg-transparent font-headline tracking-[0.3em] text-xs md:text-sm uppercase rounded-lg overflow-hidden transition-all duration-300"
              style={{
                border: isEditing ? '2px solid #8eff71' : '2px solid #3f3f46',
                color: isEditing ? '#8eff71' : '#a1a1aa',
              }}
              onMouseEnter={(e) => {
                if (!isEditing) {
                  (e.currentTarget as HTMLElement).style.borderColor = '#8eff71';
                  (e.currentTarget as HTMLElement).style.color = '#8eff71';
                }
              }}
              onMouseLeave={(e) => {
                if (!isEditing) {
                  (e.currentTarget as HTMLElement).style.borderColor = '#3f3f46';
                  (e.currentTarget as HTMLElement).style.color = '#a1a1aa';
                }
              }}
            >
              <span className="relative z-10">{isEditing ? 'DONE' : 'MANAGE PROFILES'}</span>
              <div
                className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                style={{ background: 'rgba(142, 255, 113, 0.1)' }}
              />
            </button>
          </div>
        </motion.div>
      </main>

      {/* Bottom Status Indicators */}
      <div className="fixed bottom-6 md:bottom-8 left-6 md:left-8 hidden md:block z-20">
        <div className="flex items-center gap-3 text-xs font-headline tracking-widest text-zinc-600">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>GALACTIC NETWORK SECURED</span>
        </div>
      </div>
      <div className="fixed bottom-6 md:bottom-8 right-6 md:right-8 hidden md:block z-20">
        <div className="text-xs font-headline tracking-widest text-zinc-600 text-right leading-relaxed">
          SYSTEM VERSION: 10.4.0<br />
          ENCRYPTION: LEVEL 20
        </div>
      </div>

      {/* Create profile modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateProfileModal
            onClose={() => setShowCreateModal(false)}
            onCreated={(profiles) => {
              updateProfiles(profiles);
              setShowCreateModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateProfileModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (profiles: Profile[]) => void;
}) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<AlienAvatar>('heatblast');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await profileAPI.createProfile(name.trim(), selectedAvatar);
      onCreated(data.profiles);
    } catch (err: any) {
      console.error('Profile creation error:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to create profile');
      setLoading(false);
    }
  };

  const avatarInfo = getAlienAvatarInfo(selectedAvatar);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-xl p-6 md:p-8"
        style={{
          background: '#181818',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-headline font-bold text-3xl md:text-4xl text-white mb-8 tracking-tight uppercase">
          Initialize <span style={{ color: '#8eff71' }}>DNA</span>
        </h2>

        {error && (
          <div className="mb-6 p-4 rounded bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate}>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8 pb-8" style={{ borderBottom: '1px solid rgba(142, 255, 113, 0.1)' }}>
            <div className="flex flex-col items-center shrink-0">
              {/* Selected Avatar Preview */}
              <motion.div
                key={selectedAvatar}
                initial={{ scale: 0.8, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${avatarInfo.color}40, #111)`,
                  border: `3px solid ${avatarInfo.color}`,
                  boxShadow: `0 0 40px ${avatarInfo.color}40`,
                }}
              >
                <div className="absolute inset-0 opacity-30" style={{ backgroundColor: avatarInfo.color }} />
                <span className="relative z-10 text-6xl md:text-7xl drop-shadow-lg">{avatarInfo.emoji}</span>
              </motion.div>
              <p className="text-center mt-4 text-sm font-headline text-white tracking-widest uppercase">{avatarInfo.name}</p>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Profile Name"
                required
                maxLength={30}
                className="w-full bg-[#222] text-white px-4 py-3 text-lg font-headline placeholder:text-zinc-500 focus:outline-none rounded-lg transition-all"
                style={{
                  border: '1px solid #333',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#8eff71';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(142, 255, 113, 0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#333';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <p className="text-sm text-zinc-400 font-body leading-relaxed hidden md:block">
                {avatarInfo.description}
              </p>
            </div>
          </div>

          {/* Avatar grid */}
          <h3 className="text-xl font-headline text-white mb-4 tracking-wide uppercase">Choose your <span style={{ color: '#8eff71' }}>alien</span></h3>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3 mb-8 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
            {ALIEN_AVATARS.map((alien) => (
              <motion.button
                key={alien.id}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedAvatar(alien.id)}
                className="aspect-square rounded-full flex items-center justify-center text-3xl transition-all"
                style={{
                  color: alien.color,
                  border: selectedAvatar === alien.id ? `2px solid ${alien.color}` : '2px solid transparent',
                  background: selectedAvatar === alien.id ? `${alien.color}15` : '#333',
                  boxShadow: selectedAvatar === alien.id ? `0 0 20px ${alien.color}30` : 'none',
                  transform: selectedAvatar === alien.id ? 'scale(1.05)' : undefined,
                }}
                title={alien.name}
              >
                {alien.emoji}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid rgba(142, 255, 113, 0.1)' }}>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-8 py-3 font-headline text-lg tracking-widest uppercase transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #8eff71, #2be800)',
                color: '#0b5800',
                borderRadius: '8px',
              }}
            >
              {loading ? '...' : 'Continue'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 text-zinc-400 font-headline text-lg tracking-widest uppercase hover:text-white transition-colors"
              style={{ border: '1px solid #52525b', borderRadius: '8px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
