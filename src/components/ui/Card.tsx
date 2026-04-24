import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

type Padding = 'none' | 'sm' | 'md' | 'lg';
type ShadowLevel = 'none' | 'sm' | 'md' | 'lg';
type Radius = 'md' | 'lg' | 'xl' | '2xl' | '3xl';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'beige';
  padding?: Padding;
  shadow?: ShadowLevel;
  radius?: Radius;
  hoverable?: boolean;
}

const paddingMap: Record<Padding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const shadowMap: Record<ShadowLevel, string> = {
  none: '',
  sm: 'shadow-card',
  md: 'shadow-soft',
  lg: 'shadow-hover',
};

const radiusMap: Record<Radius, string> = {
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-[20px]',
  '2xl': 'rounded-[24px]',
  '3xl': 'rounded-[32px]',
};

export function Card({
  className,
  variant = 'white',
  padding = 'md',
  shadow = 'sm',
  radius = '3xl',
  hoverable = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'border transition-all duration-200',
        variant === 'white'
          ? 'bg-white border-beige'
          : 'bg-beige border-soft-brown/20',
        paddingMap[padding],
        shadowMap[shadow],
        radiusMap[radius],
        hoverable && [
          'cursor-pointer',
          'hover:-translate-y-0.5 hover:shadow-hover',
          'active:translate-y-0 active:shadow-card',
        ],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
