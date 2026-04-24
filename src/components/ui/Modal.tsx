'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Max width of the modal card. Default: max-w-md */
  maxWidth?: string;
  /** Hide the default X close button */
  hideClose?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  maxWidth = 'max-w-md',
  hideClose = false,
  className,
  children,
}: ModalProps) {
  // lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px]"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Card */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              initial={{ opacity: 0, scale: 0.93, y: 8 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{ opacity: 0, scale: 0.93,    y: 8 }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0.2 }}
              className={cn(
                'relative w-full bg-white rounded-3xl shadow-hover border border-beige pointer-events-auto',
                maxWidth,
                className,
              )}
            >
              {/* Header row */}
              {(title || !hideClose) && (
                <div className="flex items-center justify-between px-6 pt-6 pb-0">
                  {title ? (
                    <h2
                      id="modal-title"
                      className="font-serif text-xl text-deep-brown font-semibold"
                    >
                      {title}
                    </h2>
                  ) : (
                    <span />
                  )}

                  {!hideClose && (
                    <button
                      onClick={onClose}
                      aria-label="닫기"
                      className="p-1.5 rounded-full text-soft-brown hover:bg-beige hover:text-deep-brown transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="px-6 py-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
