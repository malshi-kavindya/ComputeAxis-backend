import { type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  icon?: ReactNode;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning',
  icon,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-500',
    warning: 'bg-accent-600 hover:bg-accent-500',
    info: 'bg-blue-600 hover:bg-blue-500',
  };

  const iconBg = {
    danger: 'bg-red-500/10 text-red-400',
    warning: 'bg-amber-500/10 text-amber-400',
    info: 'bg-blue-500/10 text-blue-400',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-axis-850 border border-axis-600 rounded-xl shadow-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${iconBg[variant]}`}>
                {icon || <AlertTriangle className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-ink-100">{title}</h2>
                <p className="text-sm text-ink-400 mt-1">{message}</p>
              </div>
              <button onClick={onClose} className="text-ink-400 hover:text-ink-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={onClose} className="btn-secondary">
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`inline-flex items-center justify-center gap-2 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors ${variantStyles[variant]}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
