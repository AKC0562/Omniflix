import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      className="w-full mt-auto relative overflow-hidden"
      style={{
        background: 'linear-gradient(to top, rgba(57, 255, 20, 0.08), transparent), #000',
        borderRadius: '40px 40px 0 0',
        boxShadow: '0 -10px 30px rgba(57, 255, 20, 0.06)',
      }}
    >
      {/* Decorative Hex Grid Dots */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(#39FF14 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Main Content Row */}
      <div className="flex flex-col md:flex-row justify-between items-center px-8 md:px-12 py-12 md:py-16 max-w-[1440px] mx-auto relative z-10 gap-10 md:gap-4">
        {/* Brand Anchor */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tighter uppercase flex items-center gap-2 font-headline no-underline"
            style={{ color: '#39FF14' }}
          >
            <span
              className="material-symbols-outlined text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              dataset
            </span>
            Omniflix
          </Link>
          <p className="text-zinc-500 text-sm max-w-xs text-center md:text-left font-body tracking-normal leading-relaxed">
            Powering the galactic streaming ecosystem with hyper-saturated energy and radioactive depth.
          </p>
        </div>

        {/* Navigation Hub */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <a
            href="#"
            className="underline decoration-2 underline-offset-4 transition-all duration-300 active:scale-95 text-sm font-headline"
            style={{ color: '#39FF14' }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.filter = 'drop-shadow(0 0 8px #39FF14)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.filter = 'none';
            }}
          >
            Interstellar Support
          </a>
          <a
            href="#"
            className="text-zinc-500 uppercase text-xs tracking-widest font-headline transition-all duration-300 active:scale-95 hover:text-[#39FF14]"
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.filter = 'drop-shadow(0 0 8px #39FF14)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.filter = 'none';
            }}
          >
            Privacy Protocol
          </a>
          <a
            href="#"
            className="text-zinc-500 uppercase text-xs tracking-widest font-headline transition-all duration-300 active:scale-95 hover:text-[#39FF14]"
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.filter = 'drop-shadow(0 0 8px #39FF14)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.filter = 'none';
            }}
          >
            Terms of Use
          </a>
          <a
            href="#"
            className="text-zinc-500 uppercase text-xs tracking-widest font-headline transition-all duration-300 active:scale-95 hover:text-[#39FF14]"
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.filter = 'drop-shadow(0 0 8px #39FF14)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.filter = 'none';
            }}
          >
            System Status
          </a>
        </div>

        {/* Social / Utility Buttons */}
        <div className="flex gap-4 md:gap-6">
          {['code', 'terminal', 'play_circle', 'language', 'rss_feed'].map((icon) => (
            <button
              key={icon}
              className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 transition-all duration-300 active:scale-90"
              style={{ border: '1px solid #27272a' }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(57, 255, 20, 0.5)';
                el.querySelector('span')!.style.color = '#39FF14';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = '#27272a';
                el.querySelector('span')!.style.color = '#a1a1aa';
              }}
            >
              <span className="material-symbols-outlined text-xl" style={{ transition: 'color 0.3s' }}>
                {icon}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="py-6 md:py-8 px-8 md:px-12"
        style={{ borderTop: '1px solid rgba(57, 255, 20, 0.1)' }}
      >
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-zinc-500 text-xs font-body tracking-normal">
            © 2026 Galactic Interface Protocol. All rights reserved.
          </span>
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(24, 24, 27, 0.5)',
              border: '1px solid #27272a',
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: '#39FF14',
                boxShadow: '0 0 8px #39FF14',
              }}
            />
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              Core Status: Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
