import { motion } from 'framer-motion';

export default function OmnitrixSpinner({ size = 60 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center" role="status" aria-label="Loading">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-omnitrix-green/30"
          style={{ borderTopColor: 'var(--color-omnitrix-green)' }}
        />

        {/* Inner ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full border-2 border-alien-cyan/20"
          style={{
            inset: size * 0.15,
            borderBottomColor: 'var(--color-alien-cyan)',
          }}
        />

        {/* Center diamond (Omnitrix symbol) */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="bg-omnitrix-green rounded-sm animate-omnitrix-glow"
            style={{
              width: size * 0.22,
              height: size * 0.22,
              transform: 'rotate(45deg)',
            }}
          />
        </motion.div>

        {/* Glow effect */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-energy-pulse"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            background: 'radial-gradient(circle, rgba(0,255,65,0.15) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 bg-surface-dark flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center gap-6">
        <OmnitrixSpinner size={80} />
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-omnitrix-green font-display text-sm tracking-widest"
        >
          INITIALIZING OMNIFLIX
        </motion.p>
      </div>
    </div>
  );
}
