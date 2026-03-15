import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroBanner from '../components/movie/HeroBanner';
import MovieRow from '../components/movie/MovieRow';
import MovieModal from '../components/movie/MovieModal';
import Footer from '../components/layout/Footer';
import { tmdbAPI } from '../services/api';
import type { TMDBMovie } from '../types';

interface RowConfig {
  title: string;
  fetcher: () => Promise<{ data: any }>;
}

export default function BrowsePage() {
  const [heroMovies, setHeroMovies] = useState<TMDBMovie[]>([]);
  const [rows, setRows] = useState<{ title: string; movies: TMDBMovie[]; loading: boolean }[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);

  const rowConfigs: RowConfig[] = [
    { title: 'Trending Now', fetcher: () => tmdbAPI.getTrending() },
    { title: 'Popular Movies', fetcher: () => tmdbAPI.getPopularMovies() },
    { title: 'Top Rated', fetcher: () => tmdbAPI.getTopRatedMovies() },
    { title: 'Now Playing', fetcher: () => tmdbAPI.getNowPlayingMovies() },
    { title: 'Upcoming', fetcher: () => tmdbAPI.getUpcomingMovies() },
    { title: 'Popular TV Shows', fetcher: () => tmdbAPI.getPopularTV() },
    { title: 'Top Rated TV', fetcher: () => tmdbAPI.getTopRatedTV() },
  ];

  useEffect(() => {
    // Fetch hero movies
    tmdbAPI.getTrending('movie', 'day')
      .then(({ data }) => setHeroMovies((data as any).results || []))
      .catch(() => {})
      .finally(() => setHeroLoading(false));

    // Initialize rows with loading state
    setRows(rowConfigs.map((c) => ({ title: c.title, movies: [], loading: true })));

    // Fetch each row
    rowConfigs.forEach((config, index) => {
      config.fetcher()
        .then(({ data }) => {
          setRows((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              movies: (data as any).results || [],
              loading: false,
            };
            return updated;
          });
        })
        .catch(() => {
          setRows((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], loading: false };
            return updated;
          });
        });
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-surface-dark"
    >
      {/* Hero Banner */}
      {!heroLoading && heroMovies.length > 0 && <HeroBanner movies={heroMovies} />}
      {heroLoading && (
        <div className="w-full h-[85vh] md:h-[90vh] skeleton" />
      )}

      {/* Movie Rows */}
      <div className="relative z-10 -mt-20 md:-mt-32 pb-20">
        {rows.map((row, i) => (
          <MovieRow key={i} title={row.title} movies={row.movies} loading={row.loading} />
        ))}
      </div>

      <MovieModal />
      
      <Footer />
    </motion.div>
  );
}
