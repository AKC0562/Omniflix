import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiShield, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getAlienAvatarInfo } from '../data/alienAvatars';
import Footer from '../components/layout/Footer';

export default function AccountPage() {
  const { user, activeProfile, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user || !activeProfile) return null;
  const avatarInfo = getAlienAvatarInfo(activeProfile.avatar);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-dark pt-8 pb-16 px-4 md:px-12 lg:px-16"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-omnitrix-green rounded-full" />
          <h1 className="font-display font-bold text-2xl md:text-3xl text-text-primary tracking-wider">
            ACCOUNT
          </h1>
        </div>

        {/* Profile card */}
        <div className="glass rounded-2xl p-6 md:p-8 mb-6">
          <div className="flex items-start gap-6">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl border-2 shrink-0"
              style={{
                backgroundColor: avatarInfo.color + '20',
                borderColor: avatarInfo.color,
                boxShadow: `0 0 25px ${avatarInfo.glowColor}`,
              }}
            >
              {avatarInfo.emoji}
            </motion.div>

            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-xl text-text-primary">{activeProfile.name}</h2>
              <p className="text-sm font-body mt-1" style={{ color: avatarInfo.color }}>
                {avatarInfo.name} — {avatarInfo.description}
              </p>
            </div>
          </div>
        </div>

        {/* Account details */}
        <div className="glass rounded-2xl divide-y divide-omnitrix-green/10">
          <AccountRow icon={<FiUser />} label="Username" value={user.username} />
          <AccountRow icon={<FiMail />} label="Email" value={user.email} />
          <AccountRow icon={<FiShield />} label="Role" value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} />
          <AccountRow
            icon={<FiCalendar />}
            label="Member Since"
            value={new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          />
          <AccountRow
            icon={<FiUser />}
            label="Profiles"
            value={`${user.profiles.length} / 5`}
          />
          <AccountRow
            icon={<FiUser />}
            label="Watchlist Items"
            value={`${activeProfile.watchlist.length} titles`}
          />
        </div>

        {/* Profiles section */}
        <div className="mt-8">
          <h3 className="font-display font-semibold text-lg text-text-primary mb-4 tracking-wide">ALL PROFILES</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {user.profiles.map((profile) => {
              const info = getAlienAvatarInfo(profile.avatar);
              const isActive = profile._id === activeProfile._id;
              return (
                <motion.div
                  key={profile._id}
                  whileHover={{ scale: 1.02 }}
                  className={`glass rounded-xl p-4 flex items-center gap-3 border transition-colors ${isActive ? 'border-omnitrix-green/40' : 'border-transparent'
                    }`}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl border shrink-0"
                    style={{
                      backgroundColor: info.color + '15',
                      borderColor: info.color + '40',
                    }}
                  >
                    {info.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-body font-medium text-text-primary truncate">{profile.name}</p>
                    <p className="text-xs text-text-muted">{info.name}</p>
                    {isActive && (
                      <span className="text-[10px] text-omnitrix-green font-display">ACTIVE</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/profiles')}
            className="w-full py-3 rounded-xl glass text-text-primary font-display text-sm tracking-wider hover:bg-omnitrix-green/5 transition-colors"
          >
            MANAGE PROFILES
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger font-display text-sm tracking-wider hover:bg-danger/20 transition-colors flex items-center justify-center gap-2"
          >
            <FiLogOut size={16} />
            SIGN OUT
          </motion.button>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
}

function AccountRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <span className="text-omnitrix-green">{icon}</span>
      <span className="text-sm text-text-muted font-body w-32 shrink-0">{label}</span>
      <span className="text-sm text-text-primary font-body">{value}</span>
    </div>
  );
}
