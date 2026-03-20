import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiClock, FiTrendingUp, FiStar, FiCalendar, FiPlay } from 'react-icons/fi';
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

function saveToRecent(movie: TMDBMovie) {
  const existing = getRecentSearches().filter((m) => m.id !== movie.id);
  const updated = [movie, ...existing].slice(0, 20);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_KEY);
}

// ─── Component ─────────────────────────────────────────────────
export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [suggestions, setSuggestions] = useState<TMDBMovie[]>([]);
  const [recentSearches, setRecentSearches] = useState<TMDBMovie[]>(getRecentSearches());
  const inputRef = useRef<HTMLInputElement>(null);
  const recentRowRef = useRef<HTMLDivElement>(null);
  const openModal = useUIStore((s) => s.openModal);

  useEffect(() => {
    inputRef.current?.focus();
    // Fetch trending movies for suggestions
    tmdbAPI
      .getTrending('movie', 'week')
      .then(({ data }) => setSuggestions((data as any).results?.slice(0, 16) || []))
      .catch(() => { });
  }, []);

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
        // Save first result to recent
        if (res.length > 0 && res[0].poster_path) {
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
      const timer = setTimeout(() => performSearch(q), 500);
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

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleMovieClick = (movie: TMDBMovie) => {
    saveToRecent(movie);
    setRecentSearches(getRecentSearches());
    openModal(movie);
  };

  const visibleResults = results.filter((m) => m.poster_path);
  const visibleSuggestions = suggestions.filter((m) => m.poster_path);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-dark pt-20 pb-8"
    >
      {/* ─── SEARCH BAR ──────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 w-full backdrop-blur-xl bg-surface-dark/80 border-b border-omnitrix-green/10 py-5 px-4 md:px-12 lg:px-16">
        <div className="max-w-5xl mx-auto relative">
          <div className="relative group">
            {/* Omnitrix glow ring behind input */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-omnitrix-green/20 via-alien-cyan/10 to-omnitrix-green/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center">
              <FiSearch className="absolute left-5 text-text-muted group-focus-within:text-omnitrix-green transition-colors duration-300" size={22} />
              <input
                ref={inputRef}
                id="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, TV shows, people..."
                className="w-full bg-surface-card/70 backdrop-blur-md border border-omnitrix-green/15 text-text-primary text-lg md:text-xl rounded-2xl pl-14 pr-12 py-4 font-body placeholder:text-text-muted/60 focus:outline-none focus:border-omnitrix-green/40 focus:shadow-[0_0_25px_rgba(0,255,65,0.1)] transition-all duration-400"
              />
              {query && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={clearSearch}
                  className="absolute right-5 text-text-muted hover:text-omnitrix-green transition-colors"
                  aria-label="Clear Search"
                >
                  <FiX size={20} />
                </motion.button>
              )}
            </div>
          </div>
          {/* Search hint */}
          {!query && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-text-muted/50 text-xs font-body mt-2 pl-2"
            >
              Powered by <span className="text-omnitrix-green/60 font-display text-[10px]">OMNITRIX SEARCH ENGINE</span>
            </motion.p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16 mt-8">
        {/* ─── LOADING STATE ─────────────────────────────────────── */}
        {loading && (
          <div className="flex justify-center py-20">
            <OmnitrixSpinner size={60} />
          </div>
        )}

        {/* ─── SEARCH RESULTS ────────────────────────────────────── */}
        {!loading && query.trim() && searched && (
          <AnimatePresence>
            {visibleResults.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Results Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-1 h-7 bg-gradient-to-b from-omnitrix-green to-alien-cyan rounded-full shadow-[0_0_10px_rgba(0,255,65,0.4)]" />
                  <h2 className="font-display text-lg md:text-xl text-text-primary tracking-wider">
                    RESULTS
                  </h2>
                  <span className="text-text-muted text-sm font-body ml-1">
                    ({visibleResults.length} found)
                  </span>
                </div>

                {/* ─── Results Table: 2-Column Layout ──────────────── */}
                <div className="space-y-2">
                  {visibleResults.map((movie, i) => (
                    <SuggestionRow
                      key={movie.id}
                      movie={movie}
                      index={i}
                      onClick={() => handleMovieClick(movie)}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-card border border-omnitrix-green/20 mb-6">
                  <FiSearch size={32} className="text-text-muted" />
                </div>
                <h2 className="font-display text-xl md:text-2xl text-text-primary mb-3 tracking-wider">
                  NO RESULTS FOUND
                </h2>
                <p className="text-text-secondary font-body text-base max-w-md mx-auto">
                  No results for "<span className="text-omnitrix-green">{query}</span>". Try different keywords, titles, or genres.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ─── IDLE STATE (no query) ─────────────────────────────── */}
        {!loading && !query.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {/* ─── RECENT SEARCHES ROW ────────────────────────────── */}
            {recentSearches.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <FiClock size={18} className="text-alien-cyan" />
                    <h2 className="font-display text-base md:text-lg text-text-primary tracking-widest uppercase">
                      Recent Searches
                    </h2>
                  </div>
                  <button
                    onClick={handleClearRecent}
                    className="text-text-muted text-sm font-body hover:text-danger transition-colors flex items-center gap-1.5"
                  >
                    <FiX size={14} />
                    Clear All
                  </button>
                </div>
                {/* Horizontal scrollable row */}
                <div
                  ref={recentRowRef}
                  className="flex gap-4 overflow-x-auto hide-scrollbar pb-3 -mx-2 px-2"
                >
                  {recentSearches
                    .filter((m) => m.poster_path)
                    .map((movie, i) => (
                      <MovieCard key={movie.id} movie={movie} index={i} />
                    ))}
                </div>
              </section>
            )}

            {/* ─── SUGGESTED FOR YOU — TABLE STYLE ────────────────── */}
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <FiTrendingUp size={18} className="text-omnitrix-green" />
                <h2 className="font-display text-base md:text-lg text-text-primary tracking-widest uppercase">
                  Top Suggestions
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-omnitrix-green/20 to-transparent ml-3" />
              </div>

              {visibleSuggestions.length > 0 ? (
                <div className="space-y-2">
                  {visibleSuggestions.map((movie, i) => (
                    <SuggestionRow
                      key={movie.id}
                      movie={movie}
                      index={i}
                      onClick={() => handleMovieClick(movie)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center py-10">
                  <OmnitrixSpinner size={40} />
                </div>
              )}
            </section>
          </motion.div>
        )}
      </div>

      <MovieModal />
      <Footer />
    </motion.div>
  );
}

// ─── SUGGESTION ROW COMPONENT ──────────────────────────────────
// Professional 2-column table row: poster on left, details on right
interface SuggestionRowProps {
  movie: TMDBMovie;
  index: number;
  onClick: () => void;
}

function SuggestionRow({ movie, index, onClick }: SuggestionRowProps) {
  const title = movie.title || movie.name || 'Untitled';
  const year = (movie.release_date || movie.first_air_date || '').split('-')[0];
  const rating = movie.vote_average?.toFixed(1);
  const poster = getImageUrl(movie.poster_path, 'w185');
  const mediaType = movie.media_type === 'tv' ? 'TV Series' : 'Movie';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      onClick={onClick}
      className="group flex items-center gap-4 md:gap-5 p-3 md:p-4 rounded-xl cursor-pointer
                 bg-surface-card/40 hover:bg-surface-card/80
                 border border-transparent hover:border-omnitrix-green/20
                 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.06)]"
    >
      {/* LEFT — Movie Poster */}
      <div className="relative flex-shrink-0 w-[60px] h-[90px] md:w-[70px] md:h-[105px] rounded-lg overflow-hidden bg-surface-elevated">
        {poster ? (
          <img
            src={poster}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl">🎬</span>
          </div>
        )}
        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-surface-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <FiPlay size={20} className="text-omnitrix-green" fill="currentColor" />
        </div>
        {/* Green accent border on hover */}
        <div className="absolute inset-0 rounded-lg border border-omnitrix-green/0 group-hover:border-omnitrix-green/40 transition-all duration-300" />
      </div>

      {/* RIGHT — Movie Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg font-body font-semibold text-text-primary truncate group-hover:text-omnitrix-green transition-colors duration-300">
          {title}
        </h3>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {year && (
            <span className="flex items-center gap-1 text-text-muted text-xs md:text-sm font-body">
              <FiCalendar size={12} className="text-text-muted/60" />
              {year}
            </span>
          )}
          {rating && parseFloat(rating) > 0 && (
            <span className="flex items-center gap-1 text-xs md:text-sm font-body">
              <FiStar size={12} className="text-warning" fill="currentColor" />
              <span className="text-warning">{rating}</span>
            </span>
          )}
          <span className="text-[10px] md:text-xs font-display tracking-wider text-alien-cyan/70 bg-alien-cyan/10 px-2 py-0.5 rounded-full uppercase">
            {mediaType}
          </span>
        </div>
        {/* Overview snippet — hidden on mobile */}
        {movie.overview && (
          <p className="hidden md:block text-text-muted text-xs mt-2 line-clamp-2 leading-relaxed">
            {movie.overview}
          </p>
        )}
      </div>

      {/* Right arrow indicator */}
      <div className="flex-shrink-0 text-text-muted/30 group-hover:text-omnitrix-green/60 transition-colors duration-300">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </motion.div>
  );
}
