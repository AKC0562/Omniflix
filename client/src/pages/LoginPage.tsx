import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    } catch {}
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    clearError();
  };

  return (
    <div className="min-h-screen bg-[#050B06] flex items-center justify-center relative overflow-hidden px-4 selection:bg-omnitrix-green/30">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-omnitrix-green/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[#00E676]/10 rounded-full blur-[100px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[0.5px] border-omnitrix-green/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[0.5px] border-omnitrix-green/5 rounded-full" />
        
        {/* Animated Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,255,65,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundPosition: 'center center',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring', damping: 25 }}
        className="relative w-full max-w-xl mx-auto z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-omnitrix-green/30 to-omnitrix-green/5 p-[1px] shadow-[0_0_30px_rgba(34,197,94,0.3)] backdrop-blur-md"
          >
            <div className="w-full h-full bg-[#050B06] rounded-2xl flex items-center justify-center">
              <span className="text-omnitrix-green font-display font-bold text-4xl text-glow-green drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">O</span>
            </div>
          </motion.div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white tracking-[0.2em] drop-shadow-2xl">
            OMNI<span className="text-omnitrix-green text-glow-green">FLIX</span>
          </h1>
          <p className="text-omnitrix-green/70 text-sm font-display tracking-widest mt-3 uppercase shadow-sm">Enter the Omniverse</p>
        </div>

        {/* Form card */}
        <div className="relative rounded-3xl p-8 md:p-12 bg-[#0A120C]/80 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-omnitrix-green/20 overflow-hidden">
          {/* Subtle inner top glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-omnitrix-green/50 to-transparent" />
          
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-8 tracking-wider text-center drop-shadow-md">
            {isRegistering ? 'INITIALIZE LINK' : 'ACCESS TERMINAL'}
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm font-body"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative group">
              <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-omnitrix-green group-focus-within:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] transition-all duration-300 z-10" size={22} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-[#050B06]/80 text-white rounded-xl pl-14 pr-4 py-4 text-base md:text-lg font-body placeholder:text-text-muted/50 border border-omnitrix-green/20 focus:outline-none focus:border-omnitrix-green focus:bg-[#050B06] focus:shadow-[0_0_20px_rgba(34,197,94,0.2)_inset,0_0_20px_rgba(34,197,94,0.2)] transition-all duration-300"
              />
            </div>

            {/* Username (register only) */}
            <AnimatePresence>
              {isRegistering && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="relative group overflow-hidden"
                >
                  <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-omnitrix-green group-focus-within:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] transition-all duration-300 z-10" size={22} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    minLength={3}
                    className="w-full bg-[#050B06]/80 text-white rounded-xl pl-14 pr-4 py-4 text-base md:text-lg font-body placeholder:text-text-muted/50 border border-omnitrix-green/20 focus:outline-none focus:border-omnitrix-green focus:bg-[#050B06] focus:shadow-[0_0_20px_rgba(34,197,94,0.2)_inset,0_0_20px_rgba(34,197,94,0.2)] transition-all duration-300 mt-6 md:mt-0"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password */}
            <div className="relative group mt-6">
              <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-omnitrix-green group-focus-within:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] transition-all duration-300 z-10" size={22} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full bg-[#050B06]/80 text-white rounded-xl pl-14 pr-12 py-4 text-base md:text-lg font-body placeholder:text-text-muted/50 border border-omnitrix-green/20 focus:outline-none focus:border-omnitrix-green focus:bg-[#050B06] focus:shadow-[0_0_20px_rgba(34,197,94,0.2)_inset,0_0_20px_rgba(34,197,94,0.2)] transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted hover:text-omnitrix-green transition-colors z-10"
              >
                {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
              </button>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 0 40px rgba(34,197,94,0.6)" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="relative w-full py-4 mt-8 bg-gradient-to-r from-[#00E676] to-[#00C853] text-[#050B06] font-display font-black rounded-xl text-lg tracking-[0.2em] shadow-[0_0_20px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-[3px] border-[#050B06]/30 border-t-[#050B06] rounded-full animate-spin" />
                    DECRYPTING...
                  </>
                ) : (
                  isRegistering ? 'ESTABLISH CONNECTION' : 'LOGIN'
                )}
              </span>
            </motion.button>
          </form>

          {/* Toggle */}
          <div className="mt-8 text-center pt-8 border-t border-omnitrix-green/10">
            <p className="text-text-muted text-base font-body">
              {isRegistering ? 'Already a Plumber?' : "New to OmniFlix?"}{' '}
              <button
                onClick={toggleMode}
                className="text-white hover:text-omnitrix-green focus:text-omnitrix-green font-display font-bold tracking-wider ml-2 transition-colors drop-shadow-md"
              >
                {isRegistering ? 'ACCESS TERMINAL' : 'INITIALIZE LINK'}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 text-text-muted/40 text-xs font-display tracking-widest">
            <div className="w-8 h-[1px] bg-omnitrix-green/20" />
            POWERED BY THE OMNITRIX
            <div className="w-8 h-[1px] bg-omnitrix-green/20" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
