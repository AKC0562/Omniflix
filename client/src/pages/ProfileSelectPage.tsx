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
    }, 800);
  };

  const handleDeleteProfile = async (profileId: string) => {
    try {
      const { data } = await profileAPI.deleteProfile(profileId);
      updateProfiles(data.profiles);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-omnitrix-green/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-alien-cyan/3 rounded-full blur-3xl" />
      </div>

      {/* Transformation flash overlay */}
      <AnimatePresence>
        {transformingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.8, times: [0, 0.2, 0.6, 1] }}
            className="fixed inset-0 z-50 bg-omnitrix-green/30 backdrop-blur-sm"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 3, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 0.8 }}
                className="w-20 h-20 bg-omnitrix-green rounded-xl"
                style={{ borderRadius: '30%' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-3xl"
      >
        <h1 className="text-center font-display font-bold text-2xl md:text-3xl text-text-primary mb-2 tracking-wider">
          WHO'S WATCHING?
        </h1>
        <p className="text-center text-text-muted text-sm font-body mb-10">
          Choose your alien profile to begin streaming
        </p>

        {/* Profile grid */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-10">
          {user.profiles.map((profile, i) => {
            const avatarInfo = getAlienAvatarInfo(profile.avatar);
            return (
              <motion.div
                key={profile._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <button
                  onClick={() => handleSelectProfile(profile)}
                  className="flex flex-col items-center gap-3 w-28 md:w-32"
                >
                  {/* Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl flex items-center justify-center text-4xl md:text-5xl border-2 transition-all duration-300 cursor-pointer"
                    style={{
                      backgroundColor: avatarInfo.color + '15',
                      borderColor: avatarInfo.color + '40',
                      boxShadow: `0 0 0 rgba(0,0,0,0)`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${avatarInfo.glowColor}, 0 8px 30px rgba(0,0,0,0.3)`;
                      (e.currentTarget as HTMLElement).style.borderColor = avatarInfo.color;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 rgba(0,0,0,0)`;
                      (e.currentTarget as HTMLElement).style.borderColor = avatarInfo.color + '40';
                    }}
                  >
                    <span>{avatarInfo.emoji}</span>

                    {/* Animated ring on hover */}
                    <div className="absolute inset-[-4px] rounded-xl border border-transparent group-hover:border-current opacity-0 group-hover:opacity-30 transition-all" style={{ color: avatarInfo.color }} />
                  </motion.div>

                  {/* Name */}
                  <div className="text-center">
                    <p className="text-sm font-body font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                      {profile.name}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{avatarInfo.name}</p>
                  </div>
                </button>

                {/* Edit/Delete buttons */}
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-2 -right-2 flex gap-1"
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteProfile(profile._id); }}
                      className="w-7 h-7 rounded-full bg-danger/20 border border-danger/40 text-danger flex items-center justify-center hover:bg-danger/30 transition-colors"
                      disabled={user.profiles.length <= 1}
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {/* Add profile button */}
          {user.profiles.length < 5 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: user.profiles.length * 0.1 }}
              onClick={() => setShowCreateModal(true)}
              className="flex flex-col items-center gap-3 w-28 md:w-32"
            >
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="w-24 h-24 md:w-28 md:h-28 rounded-xl border-2 border-dashed border-text-muted/30 flex items-center justify-center hover:border-omnitrix-green/50 hover:bg-omnitrix-green/5 transition-all cursor-pointer"
              >
                <FiPlus size={32} className="text-text-muted" />
              </motion.div>
              <p className="text-sm font-body text-text-muted">Add Profile</p>
            </motion.button>
          )}
        </div>

        {/* Manage button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(!isEditing)}
            className={`px-8 py-2.5 rounded-lg font-display text-sm tracking-wider border transition-colors ${
              isEditing
                ? 'bg-omnitrix-green text-surface-dark border-omnitrix-green'
                : 'border-text-muted/40 text-text-secondary hover:border-omnitrix-green/50'
            }`}
          >
            {isEditing ? 'DONE' : 'MANAGE PROFILES'}
          </motion.button>
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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.9 }}
        className="relative glass rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display font-bold text-xl text-text-primary mb-6 tracking-wide">
          CREATE PROFILE
        </h2>

        {/* Selected avatar preview */}
        <div className="flex justify-center mb-6">
          <motion.div
            key={selectedAvatar}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="w-24 h-24 rounded-xl flex items-center justify-center text-5xl border-2"
            style={{
              backgroundColor: avatarInfo.color + '20',
              borderColor: avatarInfo.color,
              boxShadow: `0 0 30px ${avatarInfo.glowColor}`,
            }}
          >
            {avatarInfo.emoji}
          </motion.div>
        </div>
        <p className="text-center text-sm text-text-secondary mb-1 font-display">{avatarInfo.name}</p>
        <p className="text-center text-xs text-text-muted mb-6 font-body">{avatarInfo.description}</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Profile name"
            required
            maxLength={30}
            className="w-full bg-surface-card border border-omnitrix-green/15 text-text-primary rounded-lg px-4 py-3 text-sm font-body placeholder:text-text-muted focus:outline-none focus:border-omnitrix-green/50 focus:ring-1 focus:ring-omnitrix-green/20 transition-all mb-6"
          />

          {/* Avatar grid */}
          <h3 className="text-sm font-display font-semibold text-text-primary mb-3 tracking-wide">
            CHOOSE YOUR ALIEN
          </h3>
          <div className="grid grid-cols-5 md:grid-cols-6 gap-2 mb-6 max-h-[240px] overflow-y-auto pr-1">
            {ALIEN_AVATARS.map((alien) => (
              <motion.button
                key={alien.id}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedAvatar(alien.id)}
                className={`aspect-square rounded-lg flex items-center justify-center text-2xl border-2 transition-all ${
                  selectedAvatar === alien.id
                    ? 'border-current scale-110'
                    : 'border-transparent bg-surface-card/50 hover:bg-surface-card'
                }`}
                style={{
                  color: alien.color,
                  backgroundColor: selectedAvatar === alien.id ? alien.color + '20' : undefined,
                  borderColor: selectedAvatar === alien.id ? alien.color : 'transparent',
                }}
                title={alien.name}
              >
                {alien.emoji}
              </motion.button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-text-muted/30 text-text-secondary text-sm font-display hover:bg-surface-card transition-colors"
            >
              CANCEL
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 py-2.5 bg-omnitrix-green text-surface-dark font-display font-bold rounded-lg text-sm shadow-lg shadow-omnitrix-green/25 disabled:opacity-50"
            >
              {loading ? 'CREATING...' : 'CREATE'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
