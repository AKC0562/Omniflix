import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlay, FiMonitor, FiUsers, FiStar } from 'react-icons/fi';
import { ALIEN_AVATARS } from '../data/alienAvatars';
import LandingTop10 from '../components/movie/LandingTop10';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-dark overflow-hidden">
      {/* Hero section */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-omnitrix-green/5 rounded-full blur-3xl animate-energy-pulse" />
          <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-alien-cyan/5 rounded-full blur-3xl animate-energy-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-omnitrix-green/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-omnitrix-green/3 rounded-full" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,255,65,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Floating alien avatars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {ALIEN_AVATARS.slice(0, 8).map((alien, i) => (
            <motion.div
              key={alien.id}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="absolute text-3xl md:text-4xl opacity-10"
              style={{
                top: `${15 + (i * 10) % 70}%`,
                left: `${5 + (i * 13) % 90}%`,
              }}
            >
              {alien.emoji}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-omnitrix-green/10 border-2 border-omnitrix-green/40 flex items-center justify-center animate-omnitrix-glow"
            >
              <span className="text-omnitrix-green font-display font-black text-4xl">O</span>
            </motion.div>

            <h1 className="font-display font-black text-5xl md:text-7xl tracking-wider text-omnitrix-green text-glow-green mb-3">
              OMNIFLIX
            </h1>
            <div className="flex items-center justify-center gap-2 text-text-muted/60 text-xs font-display tracking-[0.4em]">
              <div className="w-12 h-[1px] bg-omnitrix-green/20" />
              STREAM THE OMNIVERSE
              <div className="w-12 h-[1px] bg-omnitrix-green/20" />
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-text-secondary font-body leading-relaxed mb-10 max-w-xl mx-auto"
          >
            Unlimited movies, TV shows, and more. Experience cinematic streaming
            with the power of the Omnitrix.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,255,65,0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-10 py-4 bg-omnitrix-green text-surface-dark font-display font-bold rounded-xl text-sm tracking-wider shadow-xl shadow-omnitrix-green/25 hover:bg-omnitrix-glow transition-colors"
              >
                <FiPlay size={18} />
                GET STARTED
              </motion.button>
            </Link>

            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-10 py-4 glass rounded-xl text-sm font-display font-medium text-text-primary tracking-wider hover:bg-omnitrix-green/10 transition-colors"
              >
                SIGN IN
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-omnitrix-green/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-omnitrix-green/50" />
          </div>
        </motion.div>
      </div>

      <LandingTop10 />

      {/* Features section */}
      <div className="py-20 px-4 md:px-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FiMonitor size={28} />,
              title: 'Stream Anywhere',
              description: 'Watch on your phone, tablet, laptop, or TV. No extra fees.',
              color: 'omnitrix-green',
            },
            {
              icon: <FiUsers size={28} />,
              title: 'Alien Profiles',
              description: 'Create up to 5 profiles with unique Ben 10 alien avatars.',
              color: 'alien-cyan',
            },
            {
              icon: <FiStar size={28} />,
              title: 'Curated Content',
              description: 'Personalized recommendations powered by AI-style algorithms.',
              color: 'alien-orange',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass rounded-2xl p-6 text-center hover:bg-omnitrix-green/5 transition-colors group"
            >
              <div className={`w-14 h-14 mx-auto rounded-xl bg-${feature.color}/10 flex items-center justify-center text-${feature.color} mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-text-muted font-body">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
