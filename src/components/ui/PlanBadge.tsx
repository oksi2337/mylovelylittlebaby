import { cn } from '@/lib/utils';
import type { Plan } from '@/types';

interface PlanBadgeProps {
  plan: Plan;
  className?: string;
}

const config: Record<
  Plan,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  free: {
    label: '무료 체험',
    bg:     'bg-soft-brown/10',
    text:   'text-soft-brown',
    border: 'border-soft-brown/25',
    dot:    'bg-soft-brown/60',
  },
  basic: {
    label: '베이직',
    bg:     'bg-amber-50',
    text:   'text-amber-700',
    border: 'border-amber-200',
    dot:    'bg-amber-400',
  },
  premium: {
    label: '프리미엄',
    bg:     'bg-warm-brown/10',
    text:   'text-warm-brown',
    border: 'border-warm-brown/30',
    dot:    'bg-warm-brown',
  },
  memory: {
    label: '메모리 북',
    bg:     'bg-deep-brown/8',
    text:   'text-deep-brown',
    border: 'border-deep-brown/20',
    dot:    'bg-deep-brown',
  },
};

export default function PlanBadge({ plan, className }: PlanBadgeProps) {
  const { label, bg, text, border, dot } = config[plan];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'px-3 py-1 rounded-full border text-xs font-semibold',
        bg, text, border,
        className,
      )}
      style={plan === 'memory' ? { backgroundColor: 'rgba(74, 47, 26, 0.08)' } : undefined}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dot)} aria-hidden="true" />
      {label}
    </span>
  );
}
