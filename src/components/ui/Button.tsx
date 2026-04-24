'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'full';
  loading?: boolean;
}

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={cn('animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props },
    ref,
  ) => {
    const base = [
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-full',
      'transition-all duration-200',
      'active:scale-[0.97]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-brown/50 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
      'select-none',
    ].join(' ');

    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary:
        'bg-warm-brown text-white hover:bg-deep-brown shadow-sm hover:shadow-hover',
      secondary:
        'bg-beige text-warm-brown border border-soft-brown/40 hover:bg-soft-brown/20 hover:shadow-card',
      ghost:
        'text-warm-brown hover:bg-beige hover:text-deep-brown',
      danger:
        'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md',
    };

    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
      full: 'px-8 py-3.5 text-base w-full',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <Spinner className="h-4 w-4 shrink-0" />
            <span>처리 중…</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
