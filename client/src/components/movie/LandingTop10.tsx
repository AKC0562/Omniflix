import { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { tmdbAPI, getImageUrl } from '../../services/api';
import { useHorizontalScroll } from '../../hooks/useTMDB';
import type { TMDBMovie } from '../../types';

export default function LandingTop10() {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollRef, scrollLeft, scrollRight } = useHorizontalScroll();

  useEffect(() => {
    tmdbAPI.getTrending('all', 'week')
      .then(res => {
        // Safe check for results
        const results = res.data?.results || [];
        setMovies(results.slice(0, 10));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || movies.length === 0) return null;

  return (
    <div className="relative group/row py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16 mb-4 md:mb-8">
        <h2 className="text-xl md:text-3xl font-display font-black text-text-primary uppercase tracking-wide">
          Trending <span className="text-omnitrix-green">Top 10</span> Today
        </h2>
        <p className="text-sm md:text-base text-text-muted mt-2">
          Discover what everyone is watching across the Omniverse
        </p>
      </div>

      <div className="relative max-w-[1400px] mx-auto">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-0 bottom-0 w-12 md:w-16 z-20 bg-gradient-to-r from-surface-dark to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
        >
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-omnitrix-green hover:bg-omnitrix-green/20 hover:scale-110 transition-transform">
            <FiChevronLeft size={24} />
          </div>
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-0 bottom-0 w-12 md:w-16 z-20 bg-gradient-to-l from-surface-dark to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
        >
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-omnitrix-green hover:bg-omnitrix-green/20 hover:scale-110 transition-transform">
            <FiChevronRight size={24} />
          </div>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-8 px-4 md:px-12 lg:px-16 overflow-x-auto hide-scrollbar scroll-smooth pb-8 pt-4"
        >
          {movies.map((movie, index) => {
            const title = movie.title || movie.name || 'Untitled';
            const poster = getImageUrl(movie.poster_path, 'w500');

            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative flex-shrink-0 flex items-end group w-[200px] md:w-[260px] lg:w-[300px]"
              >
                {/* Giant Number behind poster */}
                <div 
                  className="absolute -left-2 md:-left-6 lg:-left-10 -bottom-2 md:-bottom-4 font-display font-black text-[100px] md:text-[140px] lg:text-[180px] leading-none z-0 select-none group-hover:scale-110 transition-transform duration-500"
                  style={{
                    WebkitTextStroke: '2px rgba(0, 255, 65, 0.8)',
                    color: 'var(--color-surface-dark)',
                    textShadow: '0 0 30px rgba(0, 255, 65, 0.15)'
                  }}
                >
                  {index + 1}
                </div>

                {/* Poster Card */}
                <Link to="/login" className="relative z-10 w-[120px] md:w-[150px] lg:w-[170px] ml-12 md:ml-16 lg:ml-20 aspect-[2/3] block">
                  <div className="w-full h-full rounded-xl overflow-hidden shadow-xl shadow-black/60 border-2 border-transparent group-hover:border-omnitrix-green/50 transition-all duration-300 group-hover:-translate-y-2">
                    {poster ? (
                      <img
                        src={poster}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-card border border-surface-light flex items-center justify-center">
                        🎬
                      </div>
                    )}
                    
                    {/* Glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
