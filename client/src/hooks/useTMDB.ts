import { useState, useEffect, useCallback, useRef } from 'react';
import { tmdbAPI } from '../services/api';
import type { TMDBMovie, TMDBMovieDetails, TMDBResponse } from '../types';

export function useTMDBRow(fetchFn: () => Promise<{ data: TMDBResponse }>) {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchFn()
      .then(({ data }) => {
        if (!cancelled) {
          const results = (data as any).results || data.results;
          setMovies(results || []);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { movies, loading };
}

export function useMovieDetails(id: number | null) {
  const [details, setDetails] = useState<TMDBMovieDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    tmdbAPI.getMovieDetails(id)
      .then(({ data }) => setDetails(data as TMDBMovieDetails))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  return { details, loading };
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useSearch(query: string) {
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    tmdbAPI.search(debouncedQuery)
      .then(({ data }) => setResults((data as any).results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return { results, loading };
}

export function useHorizontalScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -800, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: 800, behavior: 'smooth' });
  }, []);

  return { scrollRef, scrollLeft, scrollRight };
}

export function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return size;
}
