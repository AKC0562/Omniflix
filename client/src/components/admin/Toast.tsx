// ===== Toast Notifications =====
// Animated toast for success/error messages
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiAlertCircle, FiX } from 'react-icons/fi';

interface ToastProps {
  message: string | null;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-[#00ff88]/10',
      border: 'border-[#00ff88]/30',
      text: 'text-[#00ff88]',
      icon: <FiCheck size={18} />,
    },
    error: {
      bg: 'bg-[#ff4444]/10',
      border: 'border-[#ff4444]/30',
      text: 'text-[#ff4444]',
      icon: <FiAlertCircle size={18} />,
    },
  };

  const s = styles[type];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className={`fixed top-20 left-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl
                      ${s.bg} ${s.border} border backdrop-blur-xl shadow-2xl max-w-md`}
        >
          <span className={s.text}>{s.icon}</span>
          <p className={`text-sm font-body ${s.text}`}>{message}</p>
          <button
            onClick={onClose}
            className="ml-2 text-[#555] hover:text-white transition-colors cursor-pointer"
          >
            <FiX size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
