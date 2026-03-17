import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import MovieCard from '../components/movie/MovieCard';
import MovieModal from '../components/movie/MovieModal';
import OmnitrixSpinner from '../components/ui/OmnitrixSpinner';
import Footer from '../components/layout/Footer';
import { tmdbAPI } from '../services/api';
import type { TMDBMovie } from '../types';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [suggestions, setSuggestions] = useState<TMDBMovie[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
    
    // Fetch trending for suggestions
    tmdbAPI.getTrending('movie', 'week')
      .then(({ data }) => setSuggestions((data as any).results?.slice(0, 14) || []))
      .catch(() => {});
  }, []);

  const performSearch = async (q: string) => {
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
      setResults((data as any).results || []);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced live search
  useEffect(() => {
    const q = query.trim();
    if (q) {
      const timer = setTimeout(() => {
        performSearch(q);
      }, 500);
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

  const visibleResults = results.filter(m => m.poster_path);
  const visibleSuggestions = suggestions.filter(m => m.poster_path);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-dark pt-24 pb-16 px-4 md:px-12 lg:px-16"
    >
      <div className="max-w-7xl mx-auto min-h-[60vh]">
        {/* Search bar Netflix style */}
        <div className="mb-12 relative z-10 transition-all duration-300">
          <div className="relative group">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-omnitrix-green transition-colors" size={26} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV shows, people..."
              className="w-full bg-surface-card/60 backdrop-blur-sm border border-omnitrix-green/20 text-text-primary text-xl md:text-3xl rounded-xl pl-16 pr-12 py-5 md:py-6 font-display placeholder:text-text-secondary focus:outline-none focus:border-omnitrix-green/50 focus:shadow-[0_0_20px_rgba(34,197,94,0.15)] focus:bg-surface-dark/90 transition-all duration-500"
            />
            {query && (
              <button 
                onClick={clearSearch}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                aria-label="Clear Search"
              >
                <FiX size={26} />
              </button>
            )}
          </div>
        </div>

        {/* Results / Suggestions */}
        <div className="mb-20">
          {loading ? (
            <div className="flex justify-center py-20">
              <OmnitrixSpinner size={60} />
            </div>
          ) : query.trim() && visibleResults.length > 0 ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-5"
              >
                {visibleResults.map((movie, i) => (
                  <MovieCard key={movie.id} movie={movie} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : query.trim() && searched ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-6">🔍</p>
              <h2 className="font-display text-2xl text-text-primary mb-3">No results found for "{query}"</h2>
              <p className="text-text-secondary font-body text-lg">Try different keywords, titles, or genres.</p>
            </div>
          ) : !query.trim() ? (
            /* Suggestions when empty */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="font-display text-2xl text-text-primary mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-omnitrix-green rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                Top Searches
              </h2>
              {visibleSuggestions.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-5">
                  {visibleSuggestions.map((movie, i) => (
                    <MovieCard key={movie.id} movie={movie} index={i} />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center py-10">
                  <OmnitrixSpinner size={40} />
                </div>
              )}
            </motion.div>
          ) : null}
        </div>
      </div>

      <MovieModal />
      <Footer />
    </motion.div>
  );
}
