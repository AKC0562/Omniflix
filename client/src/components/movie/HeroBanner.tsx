import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiInfo, FiPlus } from 'react-icons/fi';
import { getBackdropUrl } from '../../services/api';
import { useUIStore } from '../../store/uiStore';
import type { TMDBMovie } from '../../types';

interface Props {
  movies: TMDBMovie[];
  category?: string;
}

export default function HeroBanner({ movies, category }: Props) {
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

  const categoryLabel = category === 'tv' ? 'TRENDING TV SERIES' : category === 'movies' ? 'TRENDING MOVIES' : 'FEATURED CONTENT';

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
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
          
          {/* Ambient Glow Orbs */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute bottom-24 md:bottom-32 left-0 right-0 px-8 md:px-16 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            {/* Tag */}
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border border-primary/30">
                {categoryLabel}
              </span>
              <span className="text-on-surface-variant text-sm font-medium">
                {movie.vote_average ? `★ ${movie.vote_average.toFixed(1)} Galactic Rating` : 'NEW ENTRY'}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-black tracking-tighter text-on-surface mb-6 uppercase">
              {title}
            </h1>

            <p className="text-lg text-on-surface-variant mb-8 max-w-lg leading-relaxed line-clamp-3">
              {movie.overview}
            </p>

            <div className="flex items-center gap-4">
              <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold flex flex-row items-center gap-2 shadow-[0_0_30px_rgba(142,255,113,0.3)] hover:scale-105 active:scale-95 transition-all">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                Stream Now
              </button>

              <button
                onClick={() => openModal(movie)}
                className="bg-surface-container-high/60 backdrop-blur-md text-on-surface px-8 py-4 rounded-full font-bold flex flex-row items-center gap-2 border border-outline-variant/30 hover:bg-surface-container-high transition-all"
              >
                <span className="material-symbols-outlined">info</span>
                DNA Details
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="flex gap-2 mt-12">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${i === currentIndex
                ? 'w-12 bg-primary shadow-[0_0_10px_rgba(142,255,113,1)]'
                : 'w-4 bg-outline/30 hover:bg-outline/50'
                }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
