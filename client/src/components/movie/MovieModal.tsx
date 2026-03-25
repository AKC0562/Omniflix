import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiX, FiPlay, FiPlus, FiCheck, FiStar, FiClock, FiCalendar, FiAward, FiDollarSign, FiGlobe, FiExternalLink, FiUser, FiEdit3 } from 'react-icons/fi';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { tmdbAPI, imdbAPI, profileAPI, getBackdropUrl, getImageUrl } from '../../services/api';
import type { TMDBMovieDetails, TMDBCast, IMDbData } from '../../types';
import OmnitrixSpinner from '../ui/OmnitrixSpinner';

export default function MovieModal() {
  const { selectedMovie, isModalOpen, closeModal } = useUIStore();
  const { activeProfile, setActiveProfile } = useAuthStore();
  const [details, setDetails] = useState<TMDBMovieDetails | null>(null);
  const [imdbData, setImdbData] = useState<IMDbData | null>(null);
  const [loading, setLoading] = useState(false);
  const [imdbLoading, setImdbLoading] = useState(false);
  const [inList, setInList] = useState(false);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  useEffect(() => {
    if (!selectedMovie || !isModalOpen) return;
    setLoading(true);
    setDetails(null);
    setImdbData(null);
    setIsPlayingTrailer(false);

    const mediaType = selectedMovie.media_type === 'tv' || (selectedMovie.name && !selectedMovie.title) ? 'tv' : 'movie';
    const fetchFn = mediaType === 'tv'
      ? tmdbAPI.getTVDetails(selectedMovie.id)
      : tmdbAPI.getMovieDetails(selectedMovie.id);

    fetchFn
      .then(async ({ data }) => {
        // 1. Set TMDB Details
        const movieDetails = data as TMDBMovieDetails & { external_ids?: { imdb_id?: string } };
        setDetails(movieDetails);
        
        // 2. Fetch IMDb data
        setImdbLoading(true);
        try {
          // Extract imdb_id. TV Shows might not have it unless external_ids is included.
          let targetImdbId = movieDetails.imdb_id || movieDetails.external_ids?.imdb_id;

          if (targetImdbId) {
            // Fetch directly using the specific imdbId
            const { data: imdb } = await imdbAPI.getByImdbId(targetImdbId);
            setImdbData(imdb);
          } else {
            // Fallback for missing imdb_id (e.g., standard TV Show response)
            // Attempt to search OMDb by title and release year
            const searchTitle = movieDetails.name || movieDetails.title || selectedMovie.name || selectedMovie.title;
            const searchYear = (movieDetails.first_air_date || movieDetails.release_date || '').split('-')[0];

            if (searchTitle) {
              const { data: searchRes } = await imdbAPI.searchByTitle(searchTitle, searchYear);
              // searchRes is raw OMDb data. We need to fetch via getByImdbId to get enriched format.
              if (searchRes && (searchRes as any).imdbID) {
                const { data: enrichedImdb } = await imdbAPI.getByImdbId((searchRes as any).imdbID);
                setImdbData(enrichedImdb);
              } else {
                setImdbData(null);
              }
            } else {
              setImdbData(null);
            }
          }
        } catch (error) {
          console.error('Failed to fetch IMDb data:', error);
          setImdbData(null);
        } finally {
          setImdbLoading(false);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch TMDB details:', error);
      })
      .finally(() => setLoading(false));

    setInList(activeProfile?.watchlist.includes(selectedMovie.id) || false);
  }, [selectedMovie, isModalOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const toggleWatchlist = async () => {
    if (!activeProfile || !selectedMovie) return;
    try {
      if (inList) {
        const { data } = await profileAPI.removeFromWatchlist(activeProfile._id, selectedMovie.id);
        setInList(false);
        setActiveProfile({ ...activeProfile, watchlist: data.watchlist });
      } else {
        const { data } = await profileAPI.addToWatchlist(activeProfile._id, selectedMovie.id);
        setInList(true);
        setActiveProfile({ ...activeProfile, watchlist: data.watchlist });
      }
    } catch { }
  };

  const title = details?.title || details?.name || selectedMovie?.title || selectedMovie?.name || '';
  const backdrop = getBackdropUrl(details?.backdrop_path || selectedMovie?.backdrop_path || null);
  const year = (details?.release_date || details?.first_air_date || '').split('-')[0];
  const trailer = details?.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube');

  // Helper to get rating color
  const getRatingColor = (value: number, max: number) => {
    const pct = value / max;
    if (pct >= 0.7) return '#22c55e'; // green
    if (pct >= 0.5) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  // Parse Rotten Tomatoes rating
  const rtRating = imdbData?.ratings?.find(r => r.source === 'Rotten Tomatoes');
  const rtValue = rtRating ? parseInt(rtRating.value) : null;

  return (
    <AnimatePresence>
      {isModalOpen && selectedMovie && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-surface-dark overflow-y-auto"
          id="modal-scroll-container"
        >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full min-h-screen bg-surface-dark"
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="fixed top-4 right-4 md:top-8 md:right-8 z-[90] w-12 h-12 rounded-full bg-surface-dark/80 backdrop-blur-xl border border-text-muted/20 flex items-center justify-center text-text-primary hover:text-omnitrix-green hover:border-omnitrix-green/50 hover:bg-surface-dark shadow-2xl transition-all"
              aria-label="Close"
            >
              <FiX size={24} />
            </button>

            {loading ? (
              <div className="h-[400px] flex items-center justify-center">
                <OmnitrixSpinner size={60} />
              </div>
            ) : (
              <>
                {/* Hero image or Trailer */}
                <div className="relative h-[60vh] md:h-[75vh] bg-black">
                  {isPlayingTrailer && trailer ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&showinfo=0`}
                      title="YouTube video player"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      {backdrop && (
                        <img src={backdrop} alt={title} className="w-full h-full object-cover opacity-80" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-surface-dark to-transparent pointer-events-none" />

                      {/* Content rating badge */}
                      {imdbData?.rated && (
                        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 px-3 py-1.5 rounded border border-text-muted/50 text-text-primary text-sm font-display font-bold bg-surface-dark/70 backdrop-blur-sm shadow-lg">
                          {imdbData.rated}
                        </div>
                      )}

                      {/* Title & buttons */}
                      <div className="absolute inset-x-0 bottom-0 pb-8 md:pb-16 z-20 pointer-events-none">
                        <div className="max-w-6xl mx-auto px-6 md:px-12 pointer-events-auto">
                          <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white mb-6 md:mb-8 drop-shadow-2xl">
                            {title}
                          </h2>
                          <div className="flex flex-wrap gap-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => trailer && setIsPlayingTrailer(true)}
                              disabled={!trailer}
                              className={`flex items-center gap-2 px-8 py-3 md:py-4 font-display font-bold rounded-lg text-base md:text-lg shadow-xl ${trailer
                                ? 'bg-omnitrix-green text-surface-dark shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-omnitrix-glow transition-all'
                                : 'bg-surface-card/60 backdrop-blur-md text-text-muted border border-text-muted/30 cursor-not-allowed'
                                }`}
                            >
                              <FiPlay size={22} fill="currentColor" />
                              {trailer ? 'Play Trailer' : 'No Trailer'}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={toggleWatchlist}
                              className={`flex items-center gap-2 px-6 py-3 md:py-4 rounded-lg text-base md:text-lg font-display font-medium border backdrop-blur-md transition-all ${inList
                                ? 'border-omnitrix-green bg-omnitrix-green/20 text-omnitrix-green shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                : 'border-text-muted/50 text-text-primary bg-surface-dark/40 hover:bg-surface-dark/70 hover:border-text-primary'
                                }`}
                            >
                              {inList ? <FiCheck size={22} /> : <FiPlus size={22} />}
                              {inList ? 'In List' : 'My List'}
                            </motion.button>

                            {/* IMDb link */}
                            {imdbData?.imdbId && (
                              <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={`https://www.imdb.com/title/${imdbData.imdbId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 md:py-4 rounded-lg text-base md:text-lg font-display font-medium border border-[#f5c518]/60 text-[#f5c518] bg-[#f5c518]/10 hover:bg-[#f5c518]/20 backdrop-blur-md transition-all shadow-[0_0_15px_rgba(245,197,24,0.15)]"
                              >
                                <FiExternalLink size={20} />
                                IMDb
                              </motion.a>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Details body */}
                <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 md:py-12">
                  {/* ===== RATINGS ROW ===== */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {/* TMDB Rating */}
                    {details?.vote_average && details.vote_average > 0 && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-omnitrix-green/15">
                        <FiStar size={14} className="text-omnitrix-green" />
                        <span className="text-omnitrix-green font-display font-bold text-sm">
                          {details.vote_average.toFixed(1)}
                        </span>
                        <span className="text-text-muted text-xs">/10</span>
                        <span className="text-text-muted text-[10px] ml-1 opacity-70">TMDB</span>
                      </div>
                    )}

                    {/* IMDb Rating */}
                    {imdbData?.imdbRating && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
                        style={{
                          borderColor: `${getRatingColor(imdbData.imdbRating, 10)}30`,
                          backgroundColor: `${getRatingColor(imdbData.imdbRating, 10)}08`,
                        }}
                      >
                        <span className="text-[#f5c518] font-bold text-xs">⭐</span>
                        <span
                          className="font-display font-bold text-sm"
                          style={{ color: getRatingColor(imdbData.imdbRating, 10) }}
                        >
                          {imdbData.imdbRating}
                        </span>
                        <span className="text-text-muted text-xs">/10</span>
                        <span className="text-[#f5c518] text-[10px] ml-1 font-display font-bold opacity-80">IMDb</span>
                        {imdbData.imdbVotes && (
                          <span className="text-text-muted text-[10px] ml-0.5">
                            ({imdbData.imdbVotes})
                          </span>
                        )}
                      </motion.div>
                    )}

                    {/* Rotten Tomatoes */}
                    {rtValue !== null && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
                        style={{
                          borderColor: `${getRatingColor(rtValue, 100)}30`,
                          backgroundColor: `${getRatingColor(rtValue, 100)}08`,
                        }}
                      >
                        <span className="text-sm">{rtValue >= 60 ? '🍅' : '🤢'}</span>
                        <span
                          className="font-display font-bold text-sm"
                          style={{ color: getRatingColor(rtValue, 100) }}
                        >
                          {rtRating?.value}
                        </span>
                        <span className="text-red-400 text-[10px] font-display font-bold opacity-80">RT</span>
                      </motion.div>
                    )}

                    {/* Metacritic */}
                    {imdbData?.metascore && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
                        style={{
                          borderColor: `${getRatingColor(imdbData.metascore, 100)}30`,
                          backgroundColor: `${getRatingColor(imdbData.metascore, 100)}08`,
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-display font-bold text-white"
                          style={{ backgroundColor: getRatingColor(imdbData.metascore, 100) }}
                        >
                          {imdbData.metascore}
                        </div>
                        <span className="text-text-muted text-[10px] font-display font-bold opacity-80">META</span>
                      </motion.div>
                    )}

                    {/* IMDb loading skeleton */}
                    {imdbLoading && (
                      <div className="flex gap-2">
                        <div className="h-8 w-24 rounded-lg skeleton" />
                        <div className="h-8 w-20 rounded-lg skeleton" />
                        <div className="h-8 w-16 rounded-lg skeleton" />
                      </div>
                    )}
                  </div>

                  {/* Meta info row */}
                  <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
                    {year && (
                      <span className="flex items-center gap-1 text-text-muted">
                        <FiCalendar size={13} /> {year}
                      </span>
                    )}
                    {details?.runtime && (
                      <span className="flex items-center gap-1 text-text-muted">
                        <FiClock size={13} /> {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                      </span>
                    )}
                    {details?.genres?.slice(0, 3).map((g) => (
                      <span key={g.id} className="px-2 py-0.5 rounded bg-surface-card border border-omnitrix-green/10 text-text-secondary text-xs font-body">
                        {g.name}
                      </span>
                    ))}
                    {imdbData?.country && (
                      <span className="flex items-center gap-1 text-text-muted text-xs">
                        <FiGlobe size={12} /> {imdbData.country}
                      </span>
                    )}
                  </div>

                  {/* Overview */}
                  <p className="text-text-secondary font-body text-sm md:text-base leading-relaxed mb-6">
                    {details?.overview || selectedMovie.overview}
                  </p>

                  {/* Tagline */}
                  {details?.tagline && (
                    <p className="text-omnitrix-green/70 italic text-sm mb-6 font-body">
                      "{details.tagline}"
                    </p>
                  )}

                  {/* ===== IMDb ENRICHED DATA ===== */}
                  {imdbData && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="mb-6 p-4 rounded-xl bg-gradient-to-br from-[#f5c518]/5 via-surface-card/50 to-surface-card border border-[#f5c518]/10"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[#f5c518] font-display font-bold text-xs tracking-widest">
                          IMDb DATA
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#f5c518]/20 to-transparent" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {/* Director */}
                        {imdbData.director && (
                          <div className="flex items-start gap-2">
                            <FiUser size={13} className="text-[#f5c518] mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-text-muted text-xs block">Director</span>
                              <span className="text-text-primary font-body">{imdbData.director}</span>
                            </div>
                          </div>
                        )}

                        {/* Writer */}
                        {imdbData.writer && (
                          <div className="flex items-start gap-2">
                            <FiEdit3 size={13} className="text-[#f5c518] mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-text-muted text-xs block">Writer</span>
                              <span className="text-text-primary font-body text-xs">{imdbData.writer}</span>
                            </div>
                          </div>
                        )}

                        {/* Awards */}
                        {imdbData.awards && (
                          <div className="flex items-start gap-2">
                            <FiAward size={13} className="text-[#f5c518] mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-text-muted text-xs block">Awards</span>
                              <span className="text-text-primary font-body text-xs">{imdbData.awards}</span>
                            </div>
                          </div>
                        )}

                        {/* Box Office */}
                        {imdbData.boxOffice && (
                          <div className="flex items-start gap-2">
                            <FiDollarSign size={13} className="text-[#f5c518] mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-text-muted text-xs block">Box Office</span>
                              <span className="text-text-primary font-display font-bold">{imdbData.boxOffice}</span>
                            </div>
                          </div>
                        )}

                        {/* Language */}
                        {imdbData.language && (
                          <div className="flex items-start gap-2">
                            <FiGlobe size={13} className="text-[#f5c518] mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-text-muted text-xs block">Language</span>
                              <span className="text-text-primary font-body text-xs">{imdbData.language}</span>
                            </div>
                          </div>
                        )}

                        {/* Production */}
                        {imdbData.production && (
                          <div className="flex items-start gap-2">
                            <span className="text-[#f5c518] mt-0.5 flex-shrink-0 text-xs">🎬</span>
                            <div>
                              <span className="text-text-muted text-xs block">Production</span>
                              <span className="text-text-primary font-body text-xs">{imdbData.production}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Cast */}
                  {details?.credits?.cast && details.credits.cast.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-display font-semibold text-text-primary mb-3 tracking-wide">
                        CAST
                      </h3>
                      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                        {details.credits.cast.slice(0, 10).map((person) => (
                          <CastCard key={person.id} person={person} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trailer link */}
                  {trailer && !isPlayingTrailer && (
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          setIsPlayingTrailer(true);
                          document.getElementById('modal-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm font-display text-alien-cyan hover:bg-alien-cyan/10 transition-colors"
                      >
                        <FiPlay size={14} />
                        Watch Trailer
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CastCard({ person }: { person: TMDBCast }) {
  const img = getImageUrl(person.profile_path, 'w185');
  const navigate = useNavigate();
  const { closeModal } = useUIStore();

  const handleClick = () => {
    closeModal();
    navigate(`/actor/${person.id}`);
  };

  return (
    <div
      className="flex-shrink-0 w-20 text-center cursor-pointer group"
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
    >
      <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-surface-card border border-omnitrix-green/10 mb-1 transition-all group-hover:border-omnitrix-green/60 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.3)]">
        {img ? (
          <img src={img} alt={person.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg text-text-muted">👤</div>
        )}
      </div>
      <p className="text-xs text-text-primary truncate font-body group-hover:text-omnitrix-green transition-colors">{person.name}</p>
      <p className="text-[10px] text-text-muted truncate">{person.character}</p>
    </div>
  );
}
