// ===== Admin Stats Cards =====
// Glassmorphism stat cards with hover glow animations
import { motion } from 'framer-motion';
import { FiUsers, FiShield, FiLayers, FiTrendingUp } from 'react-icons/fi';
import type { AdminStats } from '../../types';

interface StatsCardsProps {
  stats: AdminStats | null;
  isLoading: boolean;
}

interface StatCardData {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  suffix?: string;
}

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards: StatCardData[] = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <FiUsers size={22} />,
      color: '#00ff88',
      glowColor: 'rgba(0,255,136,0.15)',
    },
    {
      label: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: <FiTrendingUp size={22} />,
      color: '#00e5ff',
      glowColor: 'rgba(0,229,255,0.15)',
    },
    {
      label: 'Total Profiles',
      value: stats?.totalProfiles || 0,
      icon: <FiLayers size={22} />,
      color: '#ff6d00',
      glowColor: 'rgba(255,109,0,0.15)',
    },
    {
      label: 'Admins',
      value: stats?.totalAdmins || 0,
      icon: <FiShield size={22} />,
      color: '#a855f7',
      glowColor: 'rgba(168,85,247,0.15)',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          whileHover={{
            scale: 1.03,
            boxShadow: `0 0 30px ${card.glowColor}, 0 0 60px ${card.glowColor}`,
          }}
          className="relative overflow-hidden rounded-2xl p-6 cursor-default
                     bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#2a2a2a]
                     transition-all duration-500 group"
        >
          {/* Subtle gradient overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${card.glowColor}, transparent 70%)`,
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#888] text-sm font-body tracking-wide">
                {card.label}
              </span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: `${card.color}15`,
                  color: card.color,
                }}
              >
                {card.icon}
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 w-24 rounded-lg skeleton" />
                <div className="h-4 w-16 rounded skeleton" />
              </div>
            ) : (
              <>
                <motion.h3
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="text-3xl md:text-4xl font-display font-bold tracking-wider"
                  style={{ color: card.color }}
                >
                  {card.value.toLocaleString()}
                  {card.suffix && (
                    <span className="text-lg ml-1 text-[#666]">{card.suffix}</span>
                  )}
                </motion.h3>
                {stats?.recentUsers !== undefined && card.label === 'Total Users' && (
                  <p className="text-[#555] text-xs font-body mt-2">
                    <span className="text-[#00ff88]">+{stats.recentUsers}</span> in last 30 days
                  </p>
                )}
              </>
            )}
          </div>

          {/* Decorative corner accent */}
          <div
            className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500"
            style={{ backgroundColor: card.color }}
          />
        </motion.div>
      ))}
    </div>
  );
}
