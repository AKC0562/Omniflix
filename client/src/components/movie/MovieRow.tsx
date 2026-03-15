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
    <div className="relative group/row mb-8 md:mb-10">
      {/* Title */}
      <div className="px-4 md:px-12 lg:px-16 mb-3 flex items-center gap-3">
        <div className="w-1 h-6 bg-omnitrix-green rounded-full" />
        <h2 className="text-lg md:text-xl font-display font-semibold text-text-primary tracking-wide">
          {title}
        </h2>
        <div className="hidden md:block h-[1px] flex-1 bg-gradient-to-r from-omnitrix-green/20 to-transparent" />
      </div>

      {/* Scroll buttons */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-12 bottom-0 w-12 z-10 bg-gradient-to-r from-surface-dark to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
        aria-label="Scroll left"
      >
        <div className="w-9 h-9 rounded-full glass flex items-center justify-center text-omnitrix-green hover:bg-omnitrix-green/20 transition-colors">
          <FiChevronLeft size={20} />
        </div>
      </button>

      <button
        onClick={scrollRight}
        className="absolute right-0 top-12 bottom-0 w-12 z-10 bg-gradient-to-l from-surface-dark to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
        aria-label="Scroll right"
      >
        <div className="w-9 h-9 rounded-full glass flex items-center justify-center text-omnitrix-green hover:bg-omnitrix-green/20 transition-colors">
          <FiChevronRight size={20} />
        </div>
      </button>

      {/* Movie cards */}
      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-4 px-4 md:px-12 lg:px-16 overflow-x-auto hide-scrollbar scroll-smooth pb-2"
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
    <div className="mb-8 md:mb-10">
      <div className="px-4 md:px-12 lg:px-16 mb-3 flex items-center gap-3">
        <div className="w-1 h-6 bg-omnitrix-green/30 rounded-full" />
        <h2 className="text-lg md:text-xl font-display font-semibold text-text-primary/50 tracking-wide">
          {title}
        </h2>
      </div>
      <div className="flex gap-3 md:gap-4 px-4 md:px-12 lg:px-16 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[160px] md:w-[200px] lg:w-[220px]">
            <div className="aspect-[2/3] rounded-lg skeleton" />
            <div className="mt-2 h-4 w-3/4 rounded skeleton" />
            <div className="mt-1 h-3 w-1/3 rounded skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}
