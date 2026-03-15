import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiInfo, FiPlus } from 'react-icons/fi';
import { getBackdropUrl } from '../../services/api';
import { useUIStore } from '../../store/uiStore';
import type { TMDBMovie } from '../../types';

interface Props {
  movies: TMDBMovie[];
}

export default function HeroBanner({ movies }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const openModal = useUIStore((s) => s.openModal);
  const featured = movies.slice(0, 5);

  const nextSlide = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % featured.length);
  }, [featured.length]);

  useEffect(() => {
    if (featured.length === 0) return;
    const id = setInterval(nextSlide, 8000);
    return () => clearInterval(id);
  }, [nextSlide, featured.length]);

  if (featured.length === 0) return null;
  const movie = featured[currentIndex];
  const title = movie.title || movie.name || '';
  const backdrop = getBackdropUrl(movie.backdrop_path);

  return (
    <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {backdrop && (
            <img
              src={backdrop}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface-dark via-surface-dark/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-surface-dark/30" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-surface-dark to-transparent" />

          {/* Sci-fi scan line */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
            <div
              className="absolute left-0 right-0 h-[2px] bg-omnitrix-green"
              style={{ animation: 'scan-line 4s linear infinite' }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute bottom-24 md:bottom-32 left-0 right-0 px-4 md:px-12 lg:px-16 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            {/* Omnitrix tag */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-omnitrix-green/10 border border-omnitrix-green/30 mb-4"
            >
              <div className="w-2 h-2 bg-omnitrix-green rounded-full animate-energy-pulse" />
              <span className="text-omnitrix-green text-xs font-display tracking-wider">
                {movie.vote_average ? `★ ${movie.vote_average.toFixed(1)}` : 'TRENDING NOW'}
              </span>
            </motion.div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-3 leading-tight">
              {title}
            </h1>

            <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-6 line-clamp-3 max-w-xl font-body">
              {movie.overview}
            </p>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 md:px-8 py-3 bg-omnitrix-green text-surface-dark font-display font-bold rounded-lg text-sm shadow-lg shadow-omnitrix-green/30 hover:bg-omnitrix-glow transition-colors"
              >
                <FiPlay size={18} />
                Play
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openModal(movie)}
                className="flex items-center gap-2 px-6 md:px-8 py-3 glass rounded-lg text-sm font-display font-medium text-text-primary hover:bg-omnitrix-green/10 transition-colors"
              >
                <FiInfo size={18} />
                More Info
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="flex gap-2 mt-8">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentIndex
                  ? 'w-8 bg-omnitrix-green glow-green'
                  : 'w-4 bg-text-muted/30 hover:bg-text-muted/50'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Omnitrix corner accent */}
      <div className="absolute top-20 right-8 hidden lg:block pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border border-omnitrix-green/10 rounded-full flex items-center justify-center"
        >
          <div className="w-3 h-3 bg-omnitrix-green/20 rounded-sm rotate-45" />
        </motion.div>
      </div>
    </div>
  );
}
