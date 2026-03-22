import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [glitchText, setGlitchText] = useState('404');

  // Glitch effect on the error code
  useEffect(() => {
    const chars = '!@#$%^&*()_+{}|:<>?0123456789';
    let interval: ReturnType<typeof setInterval>;
    const glitch = () => {
      let iterations = 0;
      interval = setInterval(() => {
        setGlitchText(
          '404'
            .split('')
            .map((char, i) =>
              i < iterations ? '404'[i] : chars[Math.floor(Math.random() * chars.length)]
            )
            .join('')
        );
        iterations += 1 / 3;
        if (iterations >= 4) clearInterval(interval);
      }, 40);
    };
    glitch();
    const loop = setInterval(glitch, 4000);
    return () => { clearInterval(interval); clearInterval(loop); };
  }, []);

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,255,65,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating orbs */}
        <motion.div
          animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[15%] left-[10%] w-[300px] h-[300px] rounded-full bg-omnitrix-green/5 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, -25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-danger/5 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[40%] right-[25%] w-[200px] h-[200px] rounded-full bg-alien-cyan/5 blur-3xl"
        />

        {/* Scan lines */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="w-full h-px bg-gradient-to-r from-transparent via-omnitrix-green/20 to-transparent"
          />
        </div>

        {/* Floating glitch fragments */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -15 + Math.random() * 30, 0],
              rotate: [0, 10 - Math.random() * 20, 0],
              opacity: [0.03, 0.08, 0.03],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.7,
            }}
            className="absolute font-display font-black text-omnitrix-green/5"
            style={{
              top: `${10 + (i * 15) % 80}%`,
              left: `${5 + (i * 17) % 90}%`,
              fontSize: `${60 + i * 20}px`,
            }}
          >
            404
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Omnitrix symbol */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100 }}
          className="mb-8"
        >
          <div className="relative w-28 h-28 mx-auto">
            {/* Outer ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-danger/30"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-2 rounded-full border border-danger/20"
            />
            {/* Core */}
            <div className="absolute inset-4 rounded-full bg-danger/10 border border-danger/40 flex items-center justify-center shadow-[0_0_40px_rgba(255,23,68,0.3),0_0_80px_rgba(255,23,68,0.1)]">
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-danger text-2xl"
              >
                ⚠
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
            className="font-display font-black text-[100px] md:text-[140px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-danger via-danger/80 to-danger/30 mb-2 select-none"
            style={{
              textShadow: '0 0 60px rgba(255,23,68,0.3)',
              WebkitTextStroke: '1px rgba(255,23,68,0.1)',
            }}
          >
            {glitchText}
          </h1>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-display font-bold text-xl md:text-2xl text-text-primary mb-3 tracking-wider"
        >
          DIMENSION NOT FOUND
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-text-muted font-body text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed"
        >
          Looks like you've slipped into an unknown dimension. The page you're looking for
          doesn't exist in this universe.
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

          <Link to="/search">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2.5 px-8 py-3.5 glass rounded-xl text-sm font-display font-medium text-text-secondary tracking-wider hover:bg-alien-cyan/10 hover:text-alien-cyan hover:border-alien-cyan/30 transition-colors"
            >
              <FiSearch size={18} />
              SEARCH
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative bottom element */}
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
