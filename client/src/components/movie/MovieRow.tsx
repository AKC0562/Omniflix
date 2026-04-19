import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import { useHorizontalScroll } from '../../hooks/useTMDB';
import type { TMDBMovie } from '../../types';

interface Props {
  title: string;
  movies: TMDBMovie[];
  loading?: boolean;
}

export default function MovieRow({ title, movies, loading }: Props) {
  const { scrollRef, scrollLeft, scrollRight } = useHorizontalScroll();

  if (loading) return <MovieRowSkeleton title={title} />;
  if (movies.length === 0) return null;

  return (
    <div className="relative group/row mb-12">
      {/* Title */}
      <div className="px-4 md:px-12 lg:px-16 mb-6 flex items-center gap-4">
        <span className="w-2 h-8 bg-primary rounded-full"></span>
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface tracking-tight">
          {title}
        </h2>
      </div>

      {/* Scroll buttons */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-16 bottom-0 w-16 z-10 bg-gradient-to-r from-surface-container-lowest to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
        aria-label="Scroll left"
      >
        <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface hover:text-primary hover:border-primary/50 transition-colors">
          <FiChevronLeft size={24} />
        </div>
      </button>

      <button
        onClick={scrollRight}
        className="absolute right-0 top-16 bottom-0 w-16 z-10 bg-gradient-to-l from-surface-container-lowest to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
        aria-label="Scroll right"
      >
        <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface hover:text-primary hover:border-primary/50 transition-colors">
          <FiChevronRight size={24} />
        </div>
      </button>

      {/* Movie cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 px-4 md:px-12 lg:px-16 overflow-x-auto no-scrollbar scroll-smooth pb-4"
      >
        {movies.map((movie, i) => (
          <MovieCard key={movie.id} movie={movie} index={i} />
        ))}
      </div>
    </div>
  );
}

function MovieRowSkeleton({ title }: { title: string }) {
  return (
    <div className="mb-12">
      <div className="px-4 md:px-12 lg:px-16 mb-6 flex items-center gap-4">
        <span className="w-2 h-8 bg-surface-container-highest rounded-full skeleton" />
        <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface-variant/50 tracking-tight">
          {title}
        </h2>
      </div>
      <div className="flex gap-4 md:gap-6 px-4 md:px-12 lg:px-16 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-48 md:w-64">
            <div className="aspect-[2/3] rounded-lg skeleton bg-surface-container-low" />
            <div className="mt-2 h-4 w-3/4 rounded skeleton bg-surface-container-low" />
            <div className="mt-1 h-3 w-1/3 rounded skeleton bg-surface-container-low" />
          </div>
        ))}
      </div>
    </div>
  );
}
