import { cn } from '@/lib/utils';

interface DonationBadgeProps {
  className?: string;
  /** 'sm' shows icon+short text, 'md' shows full message */
  size?: 'sm' | 'md';
}

export default function DonationBadge({ className, size = 'md' }: DonationBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border',
        'bg-warm-brown/8 border-warm-brown/20 text-warm-brown',
        'font-medium leading-none',
        size === 'sm'
          ? 'px-3 py-1.5 text-xs'
          : 'px-4 py-2 text-sm',
        className,
      )}
      style={{ backgroundColor: 'rgba(139, 102, 81, 0.08)' }}
    >
      <span aria-hidden="true" className={size === 'sm' ? 'text-sm' : 'text-base'}>
        🐾
      </span>
      {size === 'sm' ? (
        <span>2% 기부</span>
      ) : (
        <span>이 구매의 2%가 유기동물 보호를 위해</span>
      )}
    </span>
  );
}
