import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tmdbAPI, getImageUrl } from '../services/api';
import type { TMDBActorDetails, TMDBMovie } from '../types';
import MovieRow from '../components/movie/MovieRow';
import MovieModal from '../components/movie/MovieModal';
import Footer from '../components/layout/Footer';
import { FiArrowLeft, FiStar, FiCalendar, FiMapPin } from 'react-icons/fi';

export default function ActorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [actor, setActor] = useState<TMDBActorDetails | null>(null);
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [tvShows, setTvShows] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBio, setExpandedBio] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    tmdbAPI.getActorDetails(id)
      .then((res) => {
        setActor(res.data.data.actor);
        setMovies(res.data.data.movies.cast || []);
        // Cast media_type to 'tv' so clicks open it correctly if needed
        const tv = (res.data.data.tvShows.cast || []).map(t => ({ ...t, media_type: 'tv' as const }));
        setTvShows(tv);
      })
      .catch((err) => console.error('Failed to load actor details', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-dark pt-24 px-8 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-omnitrix-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="min-h-screen bg-surface-dark pt-24 px-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-display font-bold text-white mb-4">Actor Not Found</h2>
        <button onClick={() => navigate(-1)} className="text-omnitrix-green hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  const profileImage = getImageUrl(actor.profile_path, 'h632');
  // Sort movies and tv by popularity
  const topMovies = [...movies].sort((a, b) => b.popularity - a.popularity).slice(0, 20);
  const topTv = [...tvShows].sort((a, b) => b.popularity - a.popularity).slice(0, 20);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface-dark"
    >
      <div className="max-w-[1920px] mx-auto pt-8 md:pt-16 pb-20">
        
        {/* Back Button */}
        <div className="px-4 md:px-12 lg:px-16 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
          >
            <FiArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Actor Profile Section */}
        <div className="px-4 md:px-12 lg:px-16 flex flex-col md:flex-row gap-8 lg:gap-16 mb-16">
          {/* Left: Image */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="shrink-0 w-full md:w-64 lg:w-80"
          >
            {actor.profile_path ? (
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl glass-border">
                <img 
                  src={profileImage} 
                  alt={actor.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>
            ) : (
              <div className="aspect-[2/3] rounded-2xl bg-surface-light flex items-center justify-center glass-border">
                <span className="text-4xl font-display text-text-muted">{actor.name.charAt(0)}</span>
              </div>
            )}
          </motion.div>

          {/* Right: Info */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 text-white"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 drop-shadow-lg">
              {actor.name}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm md:text-base text-text-secondary">
               <div className="flex items-center gap-2">
                 <FiStar className="text-omnitrix-green" />
                 <span>Popularity: {actor.popularity.toFixed(1)}</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="bg-omnitrix-green/20 text-omnitrix-green px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                   {actor.known_for_department}
                 </span>
               </div>
               {actor.birthday && (
                 <div className="flex items-center gap-2">
                   <FiCalendar className="text-text-muted" />
                   <span>{actor.birthday}</span>
                 </div>
               )}
               {actor.place_of_birth && (
                 <div className="flex items-center gap-2">
                   <FiMapPin className="text-text-muted" />
                   <span>{actor.place_of_birth}</span>
                 </div>
               )}
            </div>

            {/* Biography */}
            {actor.biography && (
              <div className="mb-8 max-w-4xl">
                <h3 className="text-xl font-display font-semibold mb-3">Biography</h3>
                <div className={`text-text-secondary leading-relaxed font-body ${!expandedBio ? 'line-clamp-4 lg:line-clamp-6' : ''}`}>
                  {actor.biography.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-2">{paragraph}</p>
                  ))}
                </div>
                {actor.biography.length > 300 && (
                  <button 
                    onClick={() => setExpandedBio(!expandedBio)}
                    className="mt-2 text-omnitrix-green hover:text-white font-medium transition-colors"
                  >
                    {expandedBio ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Known For Section - Movies */}
        {topMovies.length > 0 && (
          <div className="mb-12">
            <MovieRow title={`Movies with ${actor.name}`} movies={topMovies} loading={false} />
          </div>
        )}

        {/* Known For Section - TV Shows */}
        {topTv.length > 0 && (
          <div className="mb-12">
            <MovieRow title={`TV Shows with ${actor.name}`} movies={topTv} loading={false} />
          </div>
        )}

      </div>
      
      <MovieModal />
      <Footer />
    </motion.div>
  );
}
