import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

interface ErrorPageProps {
  code?: number;
  title?: string;
  message?: string;
}

/* ===== Error config per status code ===== */
const ERROR_CONFIG: Record<
  number,
  { title: string; message: string; emoji: string; color: string; glowColor: string; vibe: string }
> = {
  400: {
    title: 'BAD REQUEST',
    message:
      'The Omnitrix couldn\'t understand that signal. Your request was malformed — check your input and try again.',
    emoji: '🔧',
    color: '#FF6D00',
    glowColor: 'rgba(255,109,0,0.3)',
    vibe: 'Malfunction detected in transmission protocol.',
  },
  401: {
    title: 'UNAUTHORIZED',
    message:
      'Access denied — you need to verify your identity first. Log in with your OmniFlix credentials to continue.',
    emoji: '🔒',
    color: '#FFD600',
    glowColor: 'rgba(255,214,0,0.3)',
    vibe: 'Identity verification required.',
  },
  403: {
    title: 'ACCESS FORBIDDEN',
    message:
      'This dimension is restricted. You don\'t have the clearance level to access this area of the Omniverse.',
    emoji: '⛔',
    color: '#FF1744',
    glowColor: 'rgba(255,23,68,0.3)',
    vibe: 'Security clearance insufficient.',
  },
  408: {
    title: 'REQUEST TIMEOUT',
    message:
      'The signal to the Omniverse timed out. The dimension took too long to respond — try again.',
    emoji: '⏱',
    color: '#00E5FF',
    glowColor: 'rgba(0,229,255,0.3)',
    vibe: 'Temporal anomaly detected.',
  },
  429: {
    title: 'TOO MANY REQUESTS',
    message:
      'Whoa, slow down hero! You\'re sending too many signals. Give the Omnitrix a moment to cool down.',
    emoji: '🌡',
    color: '#FF6D00',
    glowColor: 'rgba(255,109,0,0.3)',
    vibe: 'Omnitrix overheating — cooldown initiated.',
  },
  500: {
    title: 'INTERNAL SERVER ERROR',
    message:
      'Something went critically wrong on our end. The Omnitrix core is malfunctioning. Our engineers are on it.',
    emoji: '💥',
    color: '#FF1744',
    glowColor: 'rgba(255,23,68,0.4)',
    vibe: 'Critical system failure detected.',
  },
  502: {
    title: 'BAD GATEWAY',
    message:
      'The interdimensional gateway is returning invalid responses. The relay server is having issues.',
    emoji: '🌀',
    color: '#E040FB',
    glowColor: 'rgba(224,64,251,0.3)',
    vibe: 'Gateway relay compromised.',
  },
  503: {
    title: 'SERVICE UNAVAILABLE',
    message:
      'The Omniverse is currently undergoing maintenance. All services are temporarily offline — check back soon.',
    emoji: '🛠',
    color: '#FFD600',
    glowColor: 'rgba(255,214,0,0.3)',
    vibe: 'System maintenance in progress.',
  },
};

const DEFAULT_CONFIG = {
  title: 'UNKNOWN ERROR',
  message: 'An unexpected anomaly occurred in the Omniverse. This wasn\'t supposed to happen.',
  emoji: '❓',
  color: '#81C784',
  glowColor: 'rgba(129,199,132,0.3)',
  vibe: 'Unknown anomaly detected.',
};

export default function ErrorPage({ code = 500, title, message }: ErrorPageProps) {
  const navigate = useNavigate();
  const config = ERROR_CONFIG[code] || DEFAULT_CONFIG;

  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,255,65,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Themed orbs */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] left-[8%] w-[350px] h-[350px] rounded-full blur-3xl"
          style={{ backgroundColor: config.color + '08' }}
        />
        <motion.div
          animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-[15%] right-[12%] w-[300px] h-[300px] rounded-full blur-3xl"
          style={{ backgroundColor: config.color + '06' }}
        />

        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: ['-100%', '300%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="w-full h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${config.color}30, transparent)`,
            }}
          />
        </div>

        {/* Floating error code fragments */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10 + Math.random() * 20, 0],
              opacity: [0.02, 0.06, 0.02],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.9,
            }}
            className="absolute font-display font-black select-none"
            style={{
              top: `${15 + (i * 20) % 70}%`,
              left: `${8 + (i * 22) % 84}%`,
              fontSize: `${80 + i * 25}px`,
              color: config.color + '08',
            }}
          >
            {code}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Omnitrix-style indicator */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100 }}
          className="mb-8"
        >
          <div className="relative w-24 h-24 mx-auto">
            {/* Rotating rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: config.color + '30' }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 rounded-full border"
              style={{ borderColor: config.color + '20' }}
            />
            {/* Inner core */}
            <div
              className="absolute inset-4 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: config.color + '15',
                border: `1px solid ${config.color}40`,
                boxShadow: `0 0 30px ${config.glowColor}, 0 0 60px ${config.color}15`,
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-xl"
              >
                {config.emoji}
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Error code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1
            className="font-display font-black text-[90px] md:text-[120px] leading-none mb-1 select-none"
            style={{
              color: 'transparent',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              backgroundImage: `linear-gradient(to bottom, ${config.color}, ${config.color}80, ${config.color}30)`,
              textShadow: `0 0 50px ${config.glowColor}`,
            }}
          >
            {code}
          </h1>
        </motion.div>

        {/* Status vibe indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-5"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-display font-bold tracking-widest border"
            style={{
              color: config.color,
              borderColor: config.color + '30',
              backgroundColor: config.color + '08',
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            {config.vibe}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display font-bold text-xl md:text-2xl text-text-primary mb-3 tracking-wider"
        >
          {displayTitle}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-text-muted font-body text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed"
        >
          {displayMessage}
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/browse">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,255,65,0.35)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 px-8 py-3.5 bg-omnitrix-green text-surface-dark font-display font-bold rounded-xl text-sm tracking-wider shadow-lg shadow-omnitrix-green/25 hover:bg-omnitrix-glow transition-colors"
            >
              <FiHome size={18} />
              GO HOME
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2.5 px-8 py-3.5 glass rounded-xl text-sm font-display font-medium text-text-primary tracking-wider hover:bg-omnitrix-green/10 transition-colors"
          >
            <FiArrowLeft size={18} />
            GO BACK
          </motion.button>

          {(code === 500 || code === 502 || code === 503) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="flex items-center gap-2.5 px-8 py-3.5 glass rounded-xl text-sm font-display font-medium tracking-wider transition-colors"
              style={{ color: config.color }}
            >
              <FiRefreshCw size={18} />
              RETRY
            </motion.button>
          )}
        </motion.div>

        {/* Footer decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex items-center justify-center gap-3"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-omnitrix-green/20" />
          <Link to="/browse" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-omnitrix-green/15 border border-omnitrix-green/30 flex items-center justify-center group-hover:border-omnitrix-green/60 transition-colors animate-omnitrix-glow">
              <span className="text-omnitrix-green font-display font-bold text-[10px]">O</span>
            </div>
            <span className="font-display text-xs tracking-[0.3em] text-text-muted/50 group-hover:text-omnitrix-green/70 transition-colors">
              OMNIFLIX
            </span>
          </Link>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-omnitrix-green/20" />
        </motion.div>
      </div>
    </div>
  );
}
