import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { tmdbAPI, getImageUrl, getBackdropUrl } from '../services/api';
import type { TMDBMovie } from '../types';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  const [topMovies, setTopMovies] = useState<TMDBMovie[]>([]);
  const [trendingEarth, setTrendingEarth] = useState<TMDBMovie[]>([]);
  const [originals, setOriginals] = useState<TMDBMovie[]>([]);
  const [heroBg, setHeroBg] = useState<string>('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const top10Res = await tmdbAPI.getTrending('movie', 'day');
        const earthRes = await tmdbAPI.getPopularMovies(1);
        const originalRes = await tmdbAPI.getTopRatedMovies(1);

        const top10List = top10Res.data?.results || [];
        setTopMovies(top10List.slice(0, 10));
        setTrendingEarth((earthRes.data?.results || []).slice(0, 6));
        setOriginals((originalRes.data?.results || []).slice(0, 2));

        if (top10List.length > 0) {
          setHeroBg(getBackdropUrl(top10List[0].backdrop_path));
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="bg-surface-container-lowest text-on-surface overflow-x-hidden selection:bg-primary selection:text-on-primary min-h-screen">
      {/* TopNavBar Component */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 backdrop-blur-md bg-zinc-950/30">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tighter text-lime-400 font-headline">OMNIFLIX</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-zinc-400 font-headline tracking-tight hover:text-lime-300 transition-colors duration-300 scale-95 active:scale-90">Sign In</Link>
          <Link to="/login" className="bg-primary px-6 py-2 rounded-full text-on-primary font-bold font-headline tracking-tight hover:bg-primary-dim transition-all scale-95 active:scale-90">Join</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img alt="Hero Area Background" className="w-full h-full object-cover opacity-50" src={heroBg || "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop"} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center w-full max-w-5xl space-y-8 px-6 text-center">
          <h1 className="font-headline text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white">
            OMNIFLIX: THE UNIVERSE'S <br />
            <span className="text-primary neon-glow">BEST STORIES</span>
          </h1>
          <p className="font-body text-on-surface-variant text-lg md:text-2xl max-w-2xl mx-auto font-light text-center">
            Stream all 10,000+ alien transformations. Watch anywhere. Cancel anytime.
          </p>
          <div className="pt-8 flex justify-center w-full">
            <Link to="/login" className="inline-block bg-primary text-on-primary font-headline text-xl font-bold px-12 py-5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(142,255,113,0.4)]">
              START YOUR DNA LINK
            </Link>
          </div>
        </div>
        {/* Animated Kinetic Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs font-label tracking-[0.3em] uppercase text-primary">Scanning Below</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </header>

      <main className="relative z-10 space-y-24 pb-24 top-[-2rem]">
        {/* Top 10 Row */}
        <section className="pl-8 md:pl-16">
          <h2 className="font-headline text-2xl md:text-3xl font-bold mb-8 text-on-surface flex items-center gap-4">
            <span className="w-2 h-8 bg-primary rounded-full"></span>
            Top 10 Today in the Galaxy
          </h2>
          <div className="flex overflow-x-auto gap-8 pb-12 pt-4 no-scrollbar scroll-smooth">
            {topMovies.map((movie, index) => (
              <div key={movie.id} className="flex-none flex items-end group">
                <span className="text-[10rem] md:text-[14rem] font-headline font-black text-outline leading-none tracking-tighter -mr-10 md:-mr-14 z-10 translate-y-6 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] select-none">
                  {index + 1}
                </span>
                <div className="w-36 h-56 md:w-56 md:h-80 rounded-lg bg-surface-container-low overflow-hidden relative transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(142,255,113,0.3)] z-0 border border-outline-variant/30">
                  <img alt={movie.title || movie.name || 'Movie'} className="w-full h-full object-cover" src={getImageUrl(movie.poster_path, 'w500')} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exclusive Intergalactic Originals */}
        <section className="px-8 md:px-16">
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">Exclusive Intergalactic Originals</h2>
            <button className="text-primary font-label uppercase tracking-widest text-sm hover:underline">View Transmission</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {originals[0] && (
              <div className="md:col-span-2 group relative overflow-hidden rounded-lg aspect-video bg-surface-container-high cursor-pointer">
                <img alt={originals[0].title || 'Original 1'} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={getBackdropUrl(originals[0].backdrop_path) || getImageUrl(originals[0].poster_path)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">Highly Rated</span>
                  </div>
                  <h3 className="font-headline text-3xl font-bold text-white mb-2">{originals[0].title || originals[0].name}</h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2 max-w-lg">{originals[0].overview}</p>
                </div>
              </div>
            )}
            {originals[1] && (
              <div className="group relative overflow-hidden rounded-lg bg-surface-container-high cursor-pointer">
                <img alt={originals[1].title || 'Original 2'} className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-110" src={getImageUrl(originals[1].poster_path)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-headline text-xl font-bold text-white">{originals[1].title || originals[1].name}</h3>
                  <p className="text-primary text-xs font-label uppercase tracking-widest mt-1">Exclusive</p>
                </div>
              </div>
            )}
            {originals.length === 0 && (
              <div className="col-span-3 text-center py-20 text-on-surface-variant">Loading Galatic Originals...</div>
            )}
          </div>
        </section>

        {/* DNA Selection Chips (Filter) */}
        <section className="flex flex-wrap gap-3 px-8 md:px-16 justify-center">
          <button className="px-8 py-3 rounded-full font-label text-sm uppercase tracking-widest bg-secondary-container text-on-secondary-container shadow-[0_0_15px_rgba(0,109,47,0.3)] border border-primary/20 transition-all">All Genres</button>
          <button className="px-8 py-3 rounded-full font-label text-sm uppercase tracking-widest bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-bright transition-all">Combat</button>
          <button className="px-8 py-3 rounded-full font-label text-sm uppercase tracking-widest bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-bright transition-all">Cosmic Horror</button>
          <button className="px-8 py-3 rounded-full font-label text-sm uppercase tracking-widest bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-bright transition-all">Comedy</button>
          <button className="px-8 py-3 rounded-full font-label text-sm uppercase tracking-widest bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-bright transition-all">Tech-War</button>
          <button className="px-8 py-3 rounded-full font-label text-sm uppercase tracking-widest bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-bright transition-all">Deep Space</button>
        </section>

        {/* Trending on Earth */}
        <section className="px-8 md:px-16">
          <h2 className="font-headline text-2xl md:text-3xl font-bold mb-8 text-on-surface">Trending on Earth</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingEarth.map((movie, i) => (
              <div key={movie.id || i} className="group relative rounded aspect-[2/3] bg-surface-container-low overflow-hidden">
                <img alt={movie.title || movie.name || `Trending Earth ${i + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" src={getImageUrl(movie.poster_path, 'w500')} />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="px-8 md:px-16 py-24">
          <div className="relative rounded-lg overflow-hidden bg-surface-container p-12 text-center flex flex-col items-center border border-primary/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(142,255,113,0.08)_0%,transparent_70%)]"></div>
            <span className="material-symbols-outlined text-primary text-6xl mb-6">sensors</span>
            <h2 className="font-headline text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">READY TO TRANSFORM?</h2>
            <p className="text-on-surface-variant max-w-xl text-lg mb-10 font-body">The watch is ready. The DNA is indexed. All that's missing is you.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md relative z-10">
              <input className="flex-1 bg-surface-container-highest border-b-2 border-outline focus:border-primary focus:ring-0 text-white font-label placeholder:text-zinc-600 transition-all outline-none py-4 px-4" placeholder="Enter your DNA Signature (Email)" type="email" />
              <button className="bg-primary text-on-primary font-headline font-bold px-8 py-4 rounded hover:bg-primary-dim transition-all uppercase tracking-wider">Initialize</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <footer className="w-full py-12 px-8 flex flex-col items-center gap-6 bg-zinc-950 border-t border-zinc-800/50">
        <span className="text-lg font-black text-lime-400 font-headline">OMNIFLIX</span>
        <div className="flex flex-wrap justify-center gap-8 text-xs font-headline tracking-widest uppercase text-zinc-500">
          <a className="hover:text-lime-400 transition-all" href="#">Privacy Policy</a>
          <a className="hover:text-lime-400 transition-all" href="#">Terms of Service</a>
          <a className="hover:text-lime-400 transition-all" href="#">Help Center</a>
          <a className="hover:text-lime-400 transition-all" href="#">Cookie Settings</a>
        </div>
        <p className="text-zinc-500 text-[10px] tracking-widest font-headline uppercase mt-4">© 2026 OMNIFLIX PROTOCOL. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
