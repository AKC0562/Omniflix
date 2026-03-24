import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiClock, FiStar, FiCalendar, FiUser, FiFilm, FiTv } from 'react-icons/fi';
import MovieCard from '../components/movie/MovieCard';
import MovieModal from '../components/movie/MovieModal';
import OmnitrixSpinner from '../components/ui/OmnitrixSpinner';
import Footer from '../components/layout/Footer';
import { tmdbAPI, getImageUrl } from '../services/api';
import { useUIStore } from '../store/uiStore';
import type { TMDBMovie } from '../types';

// ─── LocalStorage key for recent searches ─────────────────────
const RECENT_KEY = 'omniflix_recent_searches';

function getRecentSearches(): TMDBMovie[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveToRecent(item: TMDBMovie) {
  const existing = getRecentSearches().filter((m) => m.id !== item.id);
  const updated = [item, ...existing].slice(0, 20);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_KEY);
}

// ─── Component ─────────────────────────────────────────────────
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<TMDBMovie[]>(getRecentSearches());
  const inputRef = useRef<HTMLInputElement>(null);
  const openModal = useUIStore((s) => s.openModal);

  const performSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setSearched(false);
        return;
      }
      setLoading(true);
      setSearched(true);
      setSearchParams({ q: q.trim() });
      try {
        const { data } = await tmdbAPI.search(q.trim());
        const res = (data as any).results || [];
        setResults(res);
        // Save first result to recent (if valid)
        if (res.length > 0 && (res[0].poster_path || res[0].profile_path)) {
          saveToRecent(res[0]);
          setRecentSearches(getRecentSearches());
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [setSearchParams]
  );

  // Debounced live search
  useEffect(() => {
    const q = query.trim();
    if (q) {
      const timer = setTimeout(() => performSearch(q), 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setSearched(false);
      setSearchParams(new URLSearchParams());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setSearchParams(new URLSearchParams());
    inputRef.current?.focus();
  };

  const handleItemClick = (item: TMDBMovie) => {
    saveToRecent(item);
    setRecentSearches(getRecentSearches());
    if (item.media_type === 'person') {
      navigate(`/actor/${item.id}`);
    } else {
      openModal(item);
    }
  };

  const movies = results.filter((r) => r.media_type === 'movie' || (!r.media_type && r.profile_path === undefined));
  const tvShows = results.filter((r) => r.media_type === 'tv');
  const actors = results.filter((r) => r.media_type === 'person' || r.profile_path !== undefined);

  // Total valid items
  const hasResults = movies.length > 0 || tvShows.length > 0 || actors.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-dark pt-4 pb-8"
    >
      {/* ─── SEARCH BAR ──────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 w-full backdrop-blur-xl bg-[#0f0f0f]/80 border-b border-white/5 py-5 px-4 md:px-12 lg:px-16">
        <div className="max-w-5xl mx-auto relative">
          <div className="relative group">
            {/* Ambient glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-omnitrix-green/10 via-alien-cyan/5 to-omnitrix-green/10 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center">
              <FiSearch className="absolute left-6 text-text-muted group-focus-within:text-white transition-colors duration-300" size={24} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, TV shows, actors..."
                className="w-full glass bg-white/5 border border-white/10 text-white text-lg md:text-xl rounded-full pl-16 pr-14 py-4 md:py-5 font-body placeholder:text-text-muted focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all duration-300"
              />
              {query && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={clearSearch}
                  className="absolute right-6 p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Clear Search"
                >
                  <FiX size={18} />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-16 mt-8">
        {/* ─── LOADING STATE ─────────────────────────────────────── */}
        {loading && (
          <div className="flex justify-center flex-col items-center gap-4 py-20">
            <OmnitrixSpinner size={60} />
            <p className="text-text-muted font-body animate-pulse">Searching global database...</p>
          </div>
        )}

        {/* ─── SEARCH RESULTS ────────────────────────────────────── */}
        {!loading && query.trim() && searched && (
          <AnimatePresence>
            {hasResults ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 pb-20"
              >
                {/* Actors Grid */}
                {actors.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <FiUser size={24} className="text-alien-cyan" />
                      <h2 className="text-2xl font-display font-bold text-white tracking-wide">Actors & People</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                      {actors.slice(0, 12).map((actor, i) => (
                        <ActorCard key={actor.id} actor={actor} index={i} onClick={() => handleItemClick(actor)} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Movies Grid */}
                {movies.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <FiFilm size={24} className="text-omnitrix-green" />
                      <h2 className="text-2xl font-display font-bold text-white tracking-wide">Movies</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-4">
                      {movies.map((movie, i) => (
                        <MovieCard key={movie.id} movie={movie} index={i} customClick={() => handleItemClick(movie)} />
                      ))}
                    </div>
                  </section>
                )}

                {/* TV Shows Grid */}
                {tvShows.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <FiTv size={24} className="text-alien-orange" />
                      <h2 className="text-2xl font-display font-bold text-white tracking-wide">TV Shows</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-4">
                      {tvShows.map((show, i) => (
                        <MovieCard key={show.id} movie={show} index={i} customClick={() => handleItemClick(show)} />
                      ))}
                    </div>
                  </section>
                )}

              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-32"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                  <FiSearch size={40} className="text-text-muted" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-4">
                  No matches found
                </h2>
                <p className="text-text-secondary font-body text-lg max-w-md mx-auto">
                  We couldn't find anything for "<span className="text-white font-semibold">{query}</span>". 
                  Try searching for a different movie, TV show, or actor.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ─── IDLE STATE (Recent Searches) ──────────────────────── */}
        {!loading && !query.trim() && recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="pt-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <FiClock size={22} className="text-text-muted" />
                <h2 className="text-xl md:text-2xl font-display font-semibold text-white tracking-wide">
                  Recent Searches
                </h2>
              </div>
              <button
                onClick={clearRecentSearches}
                className="text-text-muted hover:text-white transition-colors text-sm font-medium"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-4">
              {recentSearches.map((item, i) => (
                item.media_type === 'person' ? (
                  <ActorCard key={'recent-'+item.id} actor={item} index={i} onClick={() => handleItemClick(item)} />
                ) : (
                  <MovieCard key={'recent-'+item.id} movie={item} index={i} customClick={() => handleItemClick(item)} />
                )
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <MovieModal />
      <Footer />
    </motion.div>
  );
}

// ─── ACTOR CARD COMPONENT ──────────────────────────────────────
function ActorCard({ actor, index, onClick }: { actor: TMDBMovie; index: number; onClick: () => void }) {
  const profileImage = getImageUrl(actor.profile_path || null, 'w500');
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[2/3] rounded-xl overflow-hidden glass-border bg-surface-card relative shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        {profileImage ? (
          <img 
            src={profileImage} 
            alt={actor.name} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-light text-4xl font-display text-text-muted">
            {actor.name?.[0]}
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 transition-opacity duration-300">
          <h3 className="text-white font-display font-bold text-lg leading-tight truncate drop-shadow-md group-hover:text-alien-cyan transition-colors">
            {actor.name}
          </h3>
          {/* Note: TMDB 'person' search results usually have known_for_department */}
          <p className="text-text-muted text-xs md:text-sm font-body mt-1 truncate">
            {(actor as any).known_for_department || 'Acting'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
