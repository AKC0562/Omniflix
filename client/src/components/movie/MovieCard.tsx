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
}

export default function MovieCard({ movie, index = 0 }: Props) {
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
      className="relative flex-shrink-0 w-[160px] md:w-[200px] lg:w-[220px] group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openModal(movie)}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-surface-card">
        {poster ? (
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-card">
            <span className="text-3xl">🎬</span>
          </div>
        )}

        {/* Overlay on hover */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/50 to-transparent"
        >
          {/* Omnitrix glow border */}
          <div className="absolute inset-0 rounded-lg border border-omnitrix-green/40 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Action buttons */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full bg-omnitrix-green flex items-center justify-center text-surface-dark shadow-lg shadow-omnitrix-green/30"
              aria-label="Play"
            >
              <FiPlay size={14} fill="currentColor" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleWatchlist}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                inList
                  ? 'border-omnitrix-green bg-omnitrix-green/20 text-omnitrix-green'
                  : 'border-text-muted/50 text-text-secondary hover:border-omnitrix-green/50'
              }`}
              aria-label={inList ? 'Remove from list' : 'Add to list'}
            >
              {inList ? <FiCheck size={14} /> : <FiPlus size={14} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); openModal(movie); }}
              className="w-8 h-8 rounded-full border border-text-muted/50 text-text-secondary flex items-center justify-center ml-auto hover:border-omnitrix-green/50 transition-colors"
              aria-label="More info"
            >
              <FiChevronDown size={14} />
            </motion.button>
          </div>
        </motion.div>

        {/* Rating badge */}
        {rating && parseFloat(rating) > 0 && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-surface-dark/80 border border-omnitrix-green/30 text-omnitrix-green text-xs font-display">
            ★ {rating}
          </div>
        )}
      </div>

      {/* Title below */}
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-body font-medium text-text-primary truncate group-hover:text-omnitrix-green transition-colors">
          {title}
        </h3>
        <p className="text-xs text-text-muted mt-0.5">{year}</p>
      </div>
    </motion.div>
  );
}
