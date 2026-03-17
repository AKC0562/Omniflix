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
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center relative overflow-hidden px-4 md:px-8">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-omnitrix-green/5 rounded-full blur-[100px]" />
      </div>

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

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-6xl flex flex-col items-center justify-center -mt-12"
      >
        <h1 className="text-center font-display text-4xl md:text-5xl lg:text-6xl text-white mb-8 md:mb-12 font-medium tracking-wide">
          Who's watching?
        </h1>

        {/* Profile row */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-10 mb-16 md:mb-20">
          {user.profiles.map((profile, i) => {
            const avatarInfo = getAlienAvatarInfo(profile.avatar);
            const isTransforming = transformingId === profile._id;
            
            return (
              <motion.div
                key={profile._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative group flex flex-col items-center shrink-0"
              >
                <div className="relative">
                  <button
                    onClick={() => handleSelectProfile(profile)}
                    className="relative w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full flex items-center justify-center outline-none"
                    disabled={transformingId !== null}
                  >
                    {/* The Omnitrix Dial Base */}
                    <motion.div 
                      className="absolute inset-0 rounded-full border-4 border-[#333] bg-[#111] group-hover:border-white transition-colors duration-400 shadow-xl overflow-hidden"
                      animate={isTransforming ? { scale: 1.1, borderColor: '#22c55e', boxShadow: '0 0 50px #22c55e' } : {}}
                    >
                      {/* Dial Details (Outer Ring) */}
                      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="#222" strokeWidth="4" />
                        <circle cx="50" cy="50" r="44" fill="none" stroke={avatarInfo.color} strokeWidth="1.5" strokeDasharray="10 6" className="animate-[spin_20s_linear_infinite]" />
                        {/* Dial interface notches */}
                        <path d="M 50 0 L 50 12 M 100 50 L 88 50 M 50 100 L 50 88 M 0 50 L 12 50" stroke={avatarInfo.color} strokeWidth="3" opacity="0.9" />
                        <path d="M 15 15 L 23 23 M 85 15 L 77 23 M 15 85 L 23 77 M 85 85 L 77 77" stroke="#444" strokeWidth="2" />
                      </svg>
                      
                      {/* Omnitrix Hourglass Base (subtle dark background for contrast) */}
                      <div className="absolute inset-3 bg-black/80 rounded-full flex items-center justify-center overflow-hidden border border-[#222]">
                        <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300" style={{ backgroundColor: avatarInfo.color }} />
                        {/* Avatar Image / Emoji */}
                        <motion.span 
                          className="relative z-10 text-5xl md:text-6xl lg:text-[4.5rem] drop-shadow-2xl"
                          animate={isTransforming ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] } : { scale: 1, opacity: 1 }}
                        >
                          {avatarInfo.emoji}
                        </motion.span>
                      </div>
                      
                      {/* Glow overlay on hover */}
                      <div 
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                        style={{ boxShadow: `inset 0 0 25px ${avatarInfo.color}60` }}
                      />
                    </motion.div>
                    
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
                      className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-10 h-10 rounded-full bg-red-600 border-[3px] border-[#141414] text-white flex items-center justify-center hover:bg-red-500 transition-colors z-30 shadow-lg"
                      disabled={user.profiles.length <= 1}
                    >
                      <FiTrash2 size={18} />
                    </motion.button>
                  )}
                </div>

                {/* Profile Name */}
                <span className="mt-4 md:mt-5 text-[#808080] group-hover:text-white transition-colors duration-300 text-lg md:text-xl lg:text-2xl font-display text-center">
                  {profile.name}
                </span>
              </motion.div>
            );
          })}

          {/* Add Profile Button */}
          {user.profiles.length < 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: user.profiles.length * 0.1, duration: 0.4 }}
              className="relative group flex flex-col items-center shrink-0"
            >
              <button
                onClick={() => setShowCreateModal(true)}
                className="relative w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full flex items-center justify-center outline-none transition-colors duration-300 group-hover:bg-white"
              >
                <div className="absolute inset-0 rounded-full border-4 border-[#333] group-hover:border-white transition-colors duration-300 flex items-center justify-center bg-transparent">
                  <FiPlus size={56} className="text-[#808080] group-hover:text-black transition-colors duration-300" />
                </div>
              </button>
              <span className="mt-4 md:mt-5 text-[#808080] group-hover:text-white transition-colors duration-300 text-lg md:text-xl lg:text-2xl font-display text-center">
                Add Profile
              </span>
            </motion.div>
          )}
        </div>

        {/* Manage Profiles Button */}
        <div className="w-full flex justify-center mt-4">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-2 md:px-8 md:py-3 font-display text-[1rem] md:text-xl tracking-[0.15em] border-[1px] md:border-[1.5px] transition-all duration-300 uppercase ${
              isEditing 
                ? 'bg-white text-black border-white' 
                : 'border-[#808080] text-[#808080] hover:text-white hover:border-white'
            }`}
          >
            {isEditing ? 'Done' : 'Manage Profiles'}
          </button>
        </div>
      </motion.div>

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
        className="relative bg-[#181818] border border-white/10 rounded-xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display font-medium text-3xl md:text-4xl text-white mb-8 tracking-wide">
          Add Profile
        </h2>

        {error && (
          <div className="mb-6 p-4 rounded bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate}>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8 border-b border-white/10 pb-8">
            <div className="flex flex-col items-center shrink-0">
              {/* Selected Avatar Preview styled like a dial */}
              <motion.div
                key={selectedAvatar}
                initial={{ scale: 0.8, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[3px] flex flex-col items-center justify-center relative overflow-hidden"
                style={{
                  backgroundColor: '#111',
                  borderColor: avatarInfo.color,
                  boxShadow: `0 0 40px ${avatarInfo.color}40`,
                }}
              >
                <div className="absolute inset-0 opacity-30" style={{ backgroundColor: avatarInfo.color }} />
                <span className="relative z-10 text-6xl md:text-7xl drop-shadow-lg">{avatarInfo.emoji}</span>
              </motion.div>
              <p className="text-center mt-4 text-sm font-display text-white tracking-widest uppercase">{avatarInfo.name}</p>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-6">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
                maxLength={30}
                className="w-full bg-[#333] text-white px-4 py-3 text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-omnitrix-green transition-all"
              />
              <p className="text-sm text-gray-400 font-body leading-relaxed hidden md:block">
                {avatarInfo.description}
              </p>
            </div>
          </div>

          {/* Avatar grid */}
          <h3 className="text-xl font-display text-white mb-4">Choose your alien</h3>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3 mb-8 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
            {ALIEN_AVATARS.map((alien) => (
              <motion.button
                key={alien.id}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedAvatar(alien.id)}
                className={`aspect-square rounded-full flex items-center justify-center text-3xl border-2 transition-all ${
                  selectedAvatar === alien.id
                    ? 'scale-110 shadow-lg'
                    : 'border-transparent bg-[#333] hover:bg-[#444]'
                }`}
                style={{
                  color: alien.color,
                  borderColor: selectedAvatar === alien.id ? alien.color : 'transparent',
                }}
                title={alien.name}
              >
                {alien.emoji}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-8 py-3 bg-white text-black font-display text-lg tracking-widest uppercase hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? '...' : 'Continue'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 border border-gray-500 text-gray-400 font-display text-lg tracking-widest uppercase hover:text-white hover:border-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
