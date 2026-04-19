import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ALIEN_AVATARS } from '../data/alienAvatars';

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('heatblast');
  const { login, register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await register(email, username, password);
      } else {
        await login(email, password);
      }
      navigate('/profiles');
    } catch { }
  };

  const toggleMode = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsRegistering(!isRegistering);
    clearError();
  };

  if (isRegistering) {
    return (
      <div className="bg-background text-on-background font-body selection:bg-primary selection:text-on-primary min-h-screen relative z-0">
        <nav className="fixed top-0 w-full flex justify-between items-center px-6 py-4 z-50 bg-neutral-950/60 backdrop-blur-xl border-none bg-gradient-to-b from-neutral-900 to-transparent shadow-[0_0_30px_rgba(57,255,20,0.08)]">
          <Link to="/" className="font-headline text-2xl font-black tracking-tighter text-[#39FF14] uppercase">OMNIFLIX</Link>
          <div className="flex items-center gap-6">
            <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-label hidden sm:inline">Status: Online</span>
            <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse shadow-[0_0_8px_#39FF14]"></div>
          </div>
        </nav>
        <main className="relative min-h-screen pt-32 pb-16 px-6 md:px-12 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 dna-watermark opacity-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background pointer-events-none"></div>
          <div className="relative w-full max-w-[800px] z-10">
            <div className="mb-14 text-center mt-6">
              <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">Initialize DNA Link</h1>
              <p className="text-on-surface-variant tracking-[0.3em] uppercase text-xs md:text-sm">Secure Registration Terminal v.4.0.2</p>
              {error && <p className="text-error mt-6 text-sm md:text-base font-headline tracking-widest uppercase bg-error/10 py-3 px-6 inline-block rounded">{error}</p>}
            </div>
            <div className="bg-surface-container-high/60 backdrop-blur-3xl p-10 md:p-20 rounded-xl border-none shadow-[0_0_80px_rgba(0,0,0,0.6)] relative overflow-hidden">
              <form onSubmit={handleSubmit} className="flex flex-col gap-8 m-8 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 m-8 p-8">
                  <div className="flex flex-col gap-2 relative group">
                    <label className="font-headline text-xs tracking-[0.2em] text-on-surface-variant uppercase ml-1 block">Operator Name</label>
                    <div className="flex items-center gap-3 border-b-2 border-outline-variant focus-within:border-primary transition-colors duration-300 py-2 px-2">
                      <span className="material-symbols-outlined text-primary/70 text-xl md:text-2xl">badge</span>
                      <input required value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-transparent border-none py-2 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0 outline-none font-mono text-base md:text-lg tracking-wider" placeholder="ENTER DESIGNATION..." type="text" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 relative group">
                    <label className="font-headline text-xs tracking-[0.2em] text-on-surface-variant uppercase ml-1 block">Primary DNA Email</label>
                    <div className="flex items-center gap-3 border-b-2 border-outline-variant focus-within:border-primary transition-colors duration-300 py-2 px-2">
                      <span className="material-symbols-outlined text-primary/70 text-xl md:text-2xl">email</span>
                      <input required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border-none py-2 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0 outline-none font-mono text-base md:text-lg tracking-wider" placeholder="LINK_ID@SECTOR.COM" type="email" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 relative group mt-2">
                  <label className="font-headline text-xs tracking-[0.2em] text-on-surface-variant uppercase ml-1 block">Secure Access Key</label>
                  <div className="flex items-center gap-3 border-b-2 border-outline-variant focus-within:border-primary transition-colors duration-300 py-2 px-2">
                    <span className="material-symbols-outlined text-primary/70 text-xl md:text-2xl">key_visualizer</span>
                    <input required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-transparent border-none py-2 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0 outline-none font-mono text-base md:text-lg tracking-widest" placeholder="••••••••••••" type="password" />
                  </div>
                </div>
                <div className="pt-4">
                  <label className="block text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-6 font-label text-center">Select Starting Alien Avatar</label>
                  <div className="flex justify-center flex-wrap gap-4 md:gap-6 max-h-[220px] overflow-y-auto px-2 py-4 custom-scrollbar">
                    {ALIEN_AVATARS.map(av => (
                      <div key={av.id} onClick={() => setAvatar(av.id)} className="relative group cursor-pointer mt-2" title={av.name}>
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-[3px] p-1 transition-all duration-300 flex items-center justify-center text-3xl md:text-4xl bg-surface-container-high ${avatar === av.id ? 'border-primary scale-110' : 'border-primary/20 hover:border-primary shadow-[0_0_10px_rgba(142,255,113,0.1)] hover:shadow-[0_0_20px_rgba(142,255,113,0.4)]'}`} style={avatar === av.id ? { borderColor: av.color, boxShadow: `0 0 30px ${av.glowColor}` } : {}}>
                          {av.emoji}
                        </div>
                        <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold tracking-[0.1em] transition-opacity whitespace-nowrap uppercase ${avatar === av.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ color: avatar === av.id ? av.color : '#8eff71' }}>{av.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6">
                  <button disabled={isLoading} className="w-full py-6 md:py-8 bg-[#39FF14] text-black font-headline font-black text-xl md:text-3xl tracking-[0.4em] rounded-none hover:scale-[1.03] active:scale-95 transition-all duration-500 shadow-[0_0_50px_rgba(57,255,20,0.5)] hover:shadow-[0_0_80px_rgba(57,255,20,0.8)] uppercase flex items-center justify-center gap-4 disabled:opacity-50 disabled:scale-100" type="submit">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>fingerprint</span>
                    {isLoading ? 'ESTABLISHING...' : 'ESTABLISH LINK'}
                  </button>
                </div>
              </form>
              <div className="mt-12 pt-8 border-t border-white/10 flex justify-center gap-8 md:gap-12 text-on-surface-variant font-label text-xs md:text-sm tracking-[0.2em] flex-col sm:flex-row items-center">
                <a href="#" onClick={toggleMode} className="hover:text-primary transition-colors hover:scale-105 active:scale-95">ALREADY SECURED?</a>
                <span className="text-neutral-700 hidden sm:inline">|</span>
                <span className="flex items-center gap-2 text-primary/70"><span className="material-symbols-outlined text-lg">security</span> ENCRYPTION ACTIVE</span>
              </div>
            </div>
          </div>
        </main>
        <footer className="w-full relative z-10 py-10 border-t border-neutral-800/30 bg-black">
          <div className="flex flex-col items-center gap-6 px-8 max-w-7xl mx-auto">
            <div className="text-[#39FF14] font-bold font-headline tracking-tighter uppercase">OMNIFLIX PROTOCOL</div>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <a className="font-label text-[10px] tracking-widest uppercase text-neutral-600 hover:text-[#39FF14] transition-colors hover:tracking-[0.2em] duration-500" href="#">SYSTEM_STATUS</a>
              <a className="font-label text-[10px] tracking-widest uppercase text-neutral-600 hover:text-[#39FF14] transition-colors hover:tracking-[0.2em] duration-500" href="#">PRIVACY_LOGS</a>
              <a className="font-label text-[10px] tracking-widest uppercase text-neutral-600 hover:text-[#39FF14] transition-colors hover:tracking-[0.2em] duration-500" href="#">SECTOR_TERMS</a>
              <a className="font-label text-[10px] tracking-widest uppercase text-neutral-600 hover:text-[#39FF14] transition-colors hover:tracking-[0.2em] duration-500" href="#">SUPPORT_CORE</a>
            </div>
            <p className="font-label text-[10px] tracking-widest uppercase text-neutral-600 text-center">© 2024 GALACTIC INTERFACE PROTOCOL. ALL RIGHTS RESERVED.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest font-body text-on-surface overflow-hidden min-h-screen flex flex-col relative z-0">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface-container/40 via-surface-container-lowest to-surface-container-lowest"></div>
        <div className="absolute inset-0 hex-grid opacity-30"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-tertiary/5 blur-[120px]"></div>
      </div>
      <main className="relative z-10 flex-grow flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-[650px]">
          <div className="text-center mb-16 pt-8">
            <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-primary uppercase glow-text mb-4">OMNIFLIX</h1>
            <p className="font-headline text-sm md:text-base tracking-[0.4em] text-on-surface-variant mt-2 uppercase">Galactic Interface Protocol</p>
            {error && <p className="text-error bg-error/10 py-3 px-6 rounded inline-block text-sm md:text-base mt-6 font-headline uppercase tracking-widest">{error}</p>}
          </div>
          <div className="glass-panel rounded-2xl p-10 md:p-16 relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.7)] border-white/5">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <header className="mb-14 text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-2">DNA AUTHENTICATION</h2>
              <p className="text-on-surface-variant text-base mt-1 tracking-wider uppercase font-mono">Terminal ID: SECTOR-7G_CORE</p>
            </header>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 m-8 p-8">
              <div className="flex flex-col gap-2 relative group">
                <label className="font-headline text-xs tracking-[0.2em] text-primary uppercase ml-1 block">Operator DNA Key</label>
                <div className="flex items-center gap-3 border-b-2 border-outline-variant focus-within:border-primary transition-colors duration-300 py-2 px-2">
                  <span className="material-symbols-outlined text-primary/70 text-xl md:text-2xl">fingerprint</span>
                  <input required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent border-none py-2 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0 outline-none font-mono text-base md:text-lg tracking-wider" placeholder="IDENTIFY@PROTOCOL.GALACTIC" type="email" />
                </div>
              </div>
              <div className="flex flex-col gap-2 relative group mt-2">
                <label className="font-headline text-xs tracking-[0.2em] text-primary uppercase ml-1 block">Access Frequency</label>
                <div className="flex items-center gap-3 border-b-2 border-outline-variant focus-within:border-primary transition-colors duration-300 py-2 px-2">
                  <span className="material-symbols-outlined text-primary/70 text-xl md:text-2xl">key_visualizer</span>
                  <input required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-transparent border-none py-2 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-0 outline-none font-mono text-base md:text-lg tracking-widest" placeholder="••••••••••••" type="password" />
                </div>
              </div>
              <div className="pt-4 flex flex-col gap-10">
                <button disabled={isLoading} className="w-full bg-primary text-on-primary font-headline font-bold py-6 text-xl md:text-2xl rounded-none relative group overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(142,255,113,0.5)] active:scale-95 disabled:opacity-50 disabled:scale-100 [clip-path:polygon(5%_0,100%_0,100%_50%,95%_100%,0_100%,0_50%)]" type="submit">
                  <div className="relative z-10 flex items-center justify-center gap-3 tracking-[0.3em] uppercase">
                    {isLoading ? 'VERIFYING...' : 'VERIFY DNA'}
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>sensors</span>
                  </div>
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
                </button>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8">
                  <Link to="/" className="text-[11px] md:text-sm tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors uppercase font-medium">Head to HQ</Link>
                  <a href="#" onClick={toggleMode} className="text-[11px] md:text-sm tracking-[0.2em] text-primary border border-primary/20 px-6 py-3 rounded-full hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(142,255,113,0.2)] transition-all uppercase font-bold">Initialize New Link</a>
                </div>
              </div>
            </form>
            <div className="mt-16 flex justify-between items-end">
              <div className="flex gap-2">
                <div className="w-1.5 h-4 bg-primary animate-pulse shadow-[0_0_10px_#8eff71]"></div>
                <div className="w-1.5 h-4 bg-primary/30"></div>
                <div className="w-1.5 h-4 bg-primary/30"></div>
              </div>
              <div className="text-[10px] text-on-surface-variant tracking-[0.4em] font-mono opacity-60">ENCRYPTION: TRIPLE-QUASAR-V4</div>
            </div>
          </div>
          <footer className="mt-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <p className="font-headline text-[10px] tracking-[0.3em] text-neutral-600 uppercase">© 2024 GALACTIC INTERFACE PROTOCOL. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-6 mt-2">
                <a className="text-[9px] text-neutral-600 hover:text-primary transition-colors uppercase tracking-widest" href="#">System Status</a>
                <a className="text-[9px] text-neutral-600 hover:text-primary transition-colors uppercase tracking-widest" href="#">Privacy Logs</a>
                <a className="text-[9px] text-neutral-600 hover:text-primary transition-colors uppercase tracking-widest" href="#">Support Core</a>
              </div>
            </div>
          </footer>
        </div>
      </main>
      <div className="hidden xl:block fixed left-12 top-1/2 -translate-y-1/2 space-y-12 opacity-20 pointer-events-none z-10">
        <div className="w-px h-64 bg-gradient-to-b from-transparent via-primary to-transparent relative">
          <div className="absolute top-0 -left-1 text-[8px] font-mono text-primary rotate-90 origin-left mt-2 whitespace-nowrap">LINK_STABILITY: 99.8%</div>
        </div>
      </div>
      <div className="hidden xl:block fixed right-12 top-1/2 -translate-y-1/2 space-y-12 opacity-20 pointer-events-none z-10">
        <div className="w-px h-64 bg-gradient-to-b from-transparent via-primary to-transparent relative">
          <div className="absolute bottom-0 -left-1 text-[8px] font-mono text-primary rotate-90 origin-left mb-2 whitespace-nowrap">SECTOR_LATENCY: 4MS</div>
        </div>
      </div>
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]">
        <div className="w-full h-full bg-[linear-gradient(rgba(142,255,113,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(142,255,113,0.1)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>
    </div>
  );
}

