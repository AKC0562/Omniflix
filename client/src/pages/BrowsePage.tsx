import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
  const { category } = useParams<{ category: string }>();
  const [heroMovies, setHeroMovies] = useState<TMDBMovie[]>([]);
  const [rows, setRows] = useState<{ title: string; movies: TMDBMovie[]; loading: boolean }[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);

  const rowConfigs = useMemo<RowConfig[]>(() => {
    if (category === 'tv') {
      return [
        { title: 'Top Trending Web Series', fetcher: () => tmdbAPI.discoverTV({ origin_country: 'IN', sort_by: 'popularity.desc' }) },
        { title: 'Recommended for You', fetcher: () => tmdbAPI.getRecommendations() },
        { title: 'All Time Hit Web Series', fetcher: () => tmdbAPI.discoverTV({ sort_by: 'vote_average.desc', 'vote_count.gte': 2000 }) },
        { title: 'Latest Anime Series', fetcher: () => tmdbAPI.discoverTV({ with_original_language: 'ja', with_genres: 16, sort_by: 'first_air_date.desc', 'vote_count.gte': 10 }) },
        { title: 'Action', fetcher: () => tmdbAPI.discoverTV({ with_genres: 10759 }) },
        { title: 'Romance', fetcher: () => tmdbAPI.search('Romance') }, // Using search as a fallback since Romance is often mixed in Drama on TV
        { title: 'Comedy', fetcher: () => tmdbAPI.discoverTV({ with_genres: 35 }) },
        { title: 'Sad (Drama)', fetcher: () => tmdbAPI.discoverTV({ with_genres: 18 }) },
        { title: 'Horror / Mystery', fetcher: () => tmdbAPI.discoverTV({ with_genres: 9648 }) },
        { title: 'Kids', fetcher: () => tmdbAPI.discoverTV({ with_genres: 10762 }) },
        { title: 'Adult', fetcher: () => tmdbAPI.discoverTV({ with_keywords: '9799|3205|10099|1556', sort_by: 'popularity.desc' }) } // sex, nudity, erotica, etc.
      ];
    }

    if (category === 'movies') {
      return [
        { title: 'Top Trending Movies', fetcher: () => tmdbAPI.discoverMovies({ region: 'IN', sort_by: 'popularity.desc' }) },
        { title: 'Recommended for You', fetcher: () => tmdbAPI.getRecommendations() },
        { title: 'All Time Hit Movies', fetcher: () => tmdbAPI.discoverMovies({ sort_by: 'vote_average.desc', 'vote_count.gte': 5000 }) },
        { title: 'Anime Movies', fetcher: () => tmdbAPI.discoverMovies({ with_original_language: 'ja', with_genres: 16, sort_by: 'popularity.desc' }) },
        { title: 'Action', fetcher: () => tmdbAPI.discoverMovies({ with_genres: 28 }) },
        { title: 'Romance', fetcher: () => tmdbAPI.discoverMovies({ with_genres: 10749 }) },
        { title: 'Comedy', fetcher: () => tmdbAPI.discoverMovies({ with_genres: 35 }) },
        { title: 'Sad (Drama)', fetcher: () => tmdbAPI.discoverMovies({ with_genres: 18 }) },
        { title: 'Horror', fetcher: () => tmdbAPI.discoverMovies({ with_genres: 27 }) },
        { title: 'Kids', fetcher: () => tmdbAPI.discoverMovies({ with_genres: 10751 }) },
        { title: 'Adult', fetcher: () => tmdbAPI.discoverMovies({ certification_country: 'IN', certification: 'A', with_keywords: '9799|3205|10099|1556', sort_by: 'popularity.desc' }) }
      ];
    }

    // Default: /browse
    return [
      { title: 'Trending Movies', fetcher: () => tmdbAPI.discoverMovies({ region: 'IN', sort_by: 'popularity.desc' }) },
      { title: 'Trending Web Series', fetcher: () => tmdbAPI.discoverTV({ origin_country: 'IN', sort_by: 'popularity.desc' }) },
      { title: 'Recommended for You', fetcher: () => tmdbAPI.getRecommendations() },
      { title: 'Latest Bollywood', fetcher: () => tmdbAPI.discoverMovies({ with_original_language: 'hi', region: 'IN', sort_by: 'primary_release_date.desc', 'primary_release_date.lte': new Date().toISOString().split('T')[0], 'vote_count.gte': 5 }) },
      { title: 'Latest Hollywood', fetcher: () => tmdbAPI.discoverMovies({ with_original_language: 'en', sort_by: 'primary_release_date.desc', 'primary_release_date.lte': new Date().toISOString().split('T')[0], 'vote_count.gte': 10 }) },
      { title: 'Anime Movies', fetcher: () => tmdbAPI.discoverMovies({ with_original_language: 'ja', with_genres: 16, sort_by: 'popularity.desc' }) },
      { title: 'Cartoon Movies', fetcher: () => tmdbAPI.discoverMovies({ with_genres: 16, with_original_language: 'en', sort_by: 'popularity.desc' }) },
      { title: 'Marvel', fetcher: () => tmdbAPI.discoverMovies({ with_companies: 420, sort_by: 'popularity.desc' }) },
      { title: 'DC', fetcher: () => tmdbAPI.discoverMovies({ with_companies: 429, sort_by: 'popularity.desc' }) },
      { title: 'Sizzling Hot Movies', fetcher: () => tmdbAPI.discoverMovies({ with_keywords: '9799|3205|10099|1556', sort_by: 'popularity.desc' }) },
    ];
  }, [category]);

  useEffect(() => {
    setHeroLoading(true);
    // Fetch hero movies based on category
    const heroFetcher = category === 'tv' ? tmdbAPI.discoverTV({ origin_country: 'IN', sort_by: 'popularity.desc' }) : tmdbAPI.discoverMovies({ region: 'IN', sort_by: 'popularity.desc' });

    heroFetcher
      .then(({ data }) => setHeroMovies((data as any).results || []))
      .catch(() => { })
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
  }, [category, rowConfigs]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-surface-dark -mt-16 md:-mt-[68px]"
    >
      {/* Hero Banner */}
      {!heroLoading && heroMovies.length > 0 && <HeroBanner movies={heroMovies} category={category} />}
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
