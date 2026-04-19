import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPlus, FiCheck, FiChevronDown } from 'react-icons/fi';
import { getImageUrl } from '../../services/api';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { profileAPI } from '../../services/api';
import type { TMDBMovie } from '../../types';

interface Props {
  movie: TMDBMovie;
  index?: number;
  customClick?: () => void;
}

export default function MovieCard({ movie, index = 0, customClick }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const openModal = useUIStore((s) => s.openModal);
  const { activeProfile, setActiveProfile } = useAuthStore();
  const isInWatchlist = activeProfile?.watchlist.includes(movie.id) || false;
  const [inList, setInList] = useState(isInWatchlist);

  const title = movie.title || movie.name || 'Untitled';
  const poster = getImageUrl(movie.poster_path, 'w342');
  const year = (movie.release_date || movie.first_air_date || '').split('-')[0];
  const rating = movie.vote_average?.toFixed(1);

  const toggleWatchlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeProfile) return;
    try {
      if (inList) {
        const { data } = await profileAPI.removeFromWatchlist(activeProfile._id, movie.id);
        setInList(false);
        setActiveProfile({ ...activeProfile, watchlist: data.watchlist });
      } else {
        const { data } = await profileAPI.addToWatchlist(activeProfile._id, movie.id);
        setInList(true);
        setActiveProfile({ ...activeProfile, watchlist: data.watchlist });
      }
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative flex-shrink-0 w-48 md:w-64 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={customClick ? customClick : () => openModal(movie)}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-surface-container-low overflow-hidden rounded-lg shadow-xl shadow-black/50 group-hover:shadow-[0_0_20px_rgba(142,255,113,0.15)] transition-all object-cover duration-500 border border-transparent group-hover:border-primary/30">
        {poster ? (
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-container-low text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl">movie</span>
          </div>
        )}

        {/* Overlay on hover */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-all flex flex-col justify-end p-4"
        >
          {/* Action buttons */}
          <div className="flex justify-center items-center gap-4 mb-2">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-[0_0_20px_rgba(142,255,113,0.4)]"
              aria-label="Play"
            >
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </motion.button>
          </div>
          
          <div className="flex items-center justify-between mt-4">
             <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleWatchlist}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
                inList
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-outline text-on-surface hover:border-primary hover:text-primary'
              }`}
              aria-label={inList ? 'Remove from list' : 'Add to list'}
            >
              <span className="material-symbols-outlined">{inList ? 'check' : 'add'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); openModal(movie); }}
              className="w-10 h-10 rounded-full border border-outline text-on-surface flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              aria-label="More info"
            >
              <span className="material-symbols-outlined">info</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Rating badge (Always visible in Top corners) */}
        {rating && parseFloat(rating) > 0 && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/80 backdrop-blur-md border border-primary/20 text-primary text-xs font-bold flex items-center gap-1 shadow-lg">
            <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {rating}
          </div>
        )}
      </div>

      {/* Title below */}
      <div className="mt-4">
        <span className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1 block">
           {year}
        </span>
        <h3 className="font-headline font-bold text-lg leading-tight uppercase text-on-surface group-hover:text-primary transition-colors truncate">
          {title}
        </h3>
      </div>
    </motion.div>
  );
}
