'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  variant: ToastVariant;
  message: string;
  /** ms — default 3000 */
  duration?: number;
  /** internal: used to trigger exit animation */
  exiting?: boolean;
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Icons ───────────────────────────────────────────────────────────────────

const icons: Record<ToastVariant, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-white border-green-200 text-green-800',
  error:   'bg-white border-red-200   text-red-700',
  info:    'bg-white border-warm-brown/30 text-deep-brown',
};

const iconStyles: Record<ToastVariant, string> = {
  success: 'bg-green-100 text-green-700',
  error:   'bg-red-100   text-red-600',
  info:    'bg-warm-brown/10 text-warm-brown',
};

// ─── Single Toast item ────────────────────────────────────────────────────────

function ToastEntry({
  item,
  onRemove,
}: {
  item: ToastItem;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-soft',
        'min-w-[260px] max-w-[360px] w-full',
        'transition-all duration-300',
        item.exiting
          ? 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          : 'opacity-100 translate-y-0 scale-100',
        variantStyles[item.variant],
      )}
    >
      {/* Icon */}
      <span
        className={cn(
          'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
          iconStyles[item.variant],
        )}
      >
        {icons[item.variant]}
      </span>

      {/* Message */}
      <p className="text-sm font-medium flex-1 leading-snug">{item.message}</p>

      {/* Close */}
      <button
        onClick={() => onRemove(item.id)}
        aria-label="닫기"
        className="flex-shrink-0 text-current opacity-40 hover:opacity-80 transition-opacity text-base leading-none"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const remove = useCallback((id: string) => {
    // trigger exit animation first
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    // then remove from DOM after animation
    const t = setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      300,
    );
    timers.current.set(`exit-${id}`, t);
  }, []);

  const show = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 3000) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [...prev, { id, variant, message }]);

      const t = setTimeout(() => remove(id), duration);
      timers.current.set(id, t);
    },
    [remove],
  );

  // cleanup on unmount
  useEffect(
    () => () => timers.current.forEach(clearTimeout),
    [],
  );

  const ctx: ToastContextValue = {
    show,
    success: (m, d) => show(m, 'success', d),
    error:   (m, d) => show(m, 'error',   d),
    info:    (m, d) => show(m, 'info',    d),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}

      {/* Portal — fixed bottom center */}
      <div
        aria-label="알림"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col-reverse items-center gap-2 pointer-events-none"
      >
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <ToastEntry item={item} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
