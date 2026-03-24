import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MovieCard from '../components/movie/MovieCard';
import MovieModal from '../components/movie/MovieModal';
import OmnitrixSpinner from '../components/ui/OmnitrixSpinner';
import Footer from '../components/layout/Footer';
import { useAuthStore } from '../store/authStore';
import { tmdbAPI } from '../services/api';
import type { TMDBMovie } from '../types';

export default function MyListPage() {
  const { activeProfile } = useAuthStore();
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeProfile || activeProfile.watchlist.length === 0) {
      setLoading(false);
      return;
    }

    // Fetch details for each movie in watchlist
    const fetchMovies = async () => {
      const promises = activeProfile.watchlist.slice(0, 30).map(async (id) => {
        try {
          const { data } = await tmdbAPI.getMovieDetails(id);
          return data as TMDBMovie;
        } catch {
          return null;
        }
      });

      const results = await Promise.all(promises);
      setMovies(results.filter((m): m is TMDBMovie => m !== null));
      setLoading(false);
    };

    fetchMovies();
  }, [activeProfile?.watchlist]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-surface-dark pt-8 pb-16 px-4 md:px-12 lg:px-16"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-omnitrix-green rounded-full" />
          <h1 className="font-display font-bold text-2xl md:text-3xl text-text-primary tracking-wider">
            MY LIST
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <OmnitrixSpinner size={60} />
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {movies.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              📋
            </motion.div>
            <h2 className="font-display text-xl text-text-primary mb-2">Your list is empty</h2>
            <p className="text-text-muted font-body max-w-sm mx-auto">
              Add movies and TV shows to your list by clicking the + button on any title.
            </p>
          </div>
        )}
      </div>

      <MovieModal />
      
      <Footer />
    </motion.div>
  );
}
