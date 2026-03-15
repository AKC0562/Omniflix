import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
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

  const performSearch = (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    setSearchParams({ q: q.trim() });
    tmdbAPI.search(q.trim())
      .then(({ data }) => setResults((data as any).results || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-dark pt-24 pb-16 px-4 md:px-12 lg:px-16"
    >
      <div className="max-w-6xl mx-auto">
        {/* Search bar */}
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV shows, people..."
              className="w-full bg-surface-card border border-omnitrix-green/20 text-text-primary text-lg rounded-xl pl-12 pr-6 py-4 font-body placeholder:text-text-muted focus:outline-none focus:border-omnitrix-green/50 focus:ring-2 focus:ring-omnitrix-green/20 transition-all"
              autoFocus
            />
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <OmnitrixSpinner size={60} />
          </div>
        ) : results.length > 0 ? (
          <>
            <h2 className="font-display text-lg text-text-primary mb-6 tracking-wide">
              RESULTS FOR <span className="text-omnitrix-green">"{searchParams.get('q')}"</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
              {results.filter(m => m.poster_path).map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} index={i} />
              ))}
            </div>
          </>
        ) : searched ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="font-display text-xl text-text-primary mb-2">No results found</h2>
            <p className="text-text-muted font-body">Try different keywords or check your spelling</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              🔭
            </motion.div>
            <h2 className="font-display text-xl text-text-primary mb-2">Explore the Omniverse</h2>
            <p className="text-text-muted font-body">Search for movies, TV shows, and more</p>
          </div>
        )}
      </div>

      <MovieModal />
      
      <Footer />
    </motion.div>
  );
}
