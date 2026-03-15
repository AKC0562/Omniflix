import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-surface-dark border-t border-omnitrix-green/10 pt-16 pb-8 px-4 md:px-12 lg:px-16 relative z-10 w-full mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-omnitrix-green/30 to-omnitrix-green/5 flex items-center justify-center p-[1px] shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                <div className="w-full h-full bg-[#050B06] rounded flex items-center justify-center">
                  <span className="text-omnitrix-green font-display font-bold text-lg text-glow-green">O</span>
                </div>
              </div>
              <span className="font-display font-bold tracking-wider text-xl text-text-primary">
                OMNI<span className="text-omnitrix-green text-glow-green">FLIX</span>
              </span>
            </Link>
            <p className="text-sm text-text-muted font-body pe-4">
              Enter the Omniverse. Stream your favorite movies, TV shows, and exclusive Plumber files securely from anywhere.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-text-muted hover:text-omnitrix-green transition-colors" aria-label="Github">
                <FiGithub size={20} />
              </a>
              <a href="#" className="text-text-muted hover:text-omnitrix-green transition-colors" aria-label="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-text-muted hover:text-omnitrix-green transition-colors" aria-label="Instagram">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-text-muted hover:text-omnitrix-green transition-colors" aria-label="YouTube">
                <FiYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-display font-semibold text-text-primary mb-4 tracking-wide">Plumber Database</h3>
            <ul className="space-y-3">
              <li><Link to="/browse" className="text-sm text-text-muted hover:text-omnitrix-green transition-colors font-body">Alien Archives</Link></li>
              <li><Link to="/browse/movies" className="text-sm text-text-muted hover:text-omnitrix-green transition-colors font-body">Holo-Movies</Link></li>
              <li><Link to="/browse/tv" className="text-sm text-text-muted hover:text-omnitrix-green transition-colors font-body">Transmissions</Link></li>
              <li><Link to="/my-list" className="text-sm text-text-muted hover:text-omnitrix-green transition-colors font-body">My Omnitrix List</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="font-display font-semibold text-text-primary mb-4 tracking-wide">Help Center</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-text-muted hover:text-omnitrix-green transition-colors font-body">FAQ</a></li>
              <li><a href="#" className="text-sm text-text-muted hover:text-omnitrix-green transition-colors font-body">Device Compatibility</a></li>
              <li><a href="#" className="text-sm text-text-muted hover:text-omnitrix-green transition-colors font-body">Connection Issues</a></li>
              <li><a href="#" className="text-sm text-text-muted hover:text-omnitrix-green transition-colors font-body">Contact Support</a></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h3 className="font-display font-semibold text-text-primary mb-4 tracking-wide">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-text-muted hover:text-omnitrix-green transition-colors font-body">Terms of Use</a></li>
              <li><a href="#" className="text-sm text-text-muted hover:text-omnitrix-green transition-colors font-body">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-text-muted hover:text-omnitrix-green transition-colors font-body">Cookie Preferences</a></li>
              <li><a href="#" className="text-sm text-text-muted hover:text-omnitrix-green transition-colors font-body">Corporate Info</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-omnitrix-green/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted/50 text-xs font-display tracking-wider order-2 md:order-1">
            © {new Date().getFullYear()} OMNIFLIX · CREATED By AZMUTH · ALL RIGHTS RESERVED
          </p>

          <div className="flex items-center gap-2 text-text-muted/40 text-xs font-display tracking-widest order-1 md:order-2">
            <div className="w-4 md:w-8 h-[1px] bg-omnitrix-green/20" />
            POWERED BY THE OMNITRIX
            <div className="w-4 md:w-8 h-[1px] bg-omnitrix-green/20" />
          </div>
        </div>
      </div>
    </footer>
  );
}
