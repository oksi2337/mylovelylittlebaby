import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PlanConfig {
  id: string;
  tag?: string;
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
  note?: string;
  ctaLabel: string;
  recommended?: boolean;
  comingSoon?: boolean;
}

interface PlanCardProps {
  plan: PlanConfig;
  selected: boolean;
  onSelect: () => void;
  onNotify?: () => void; // only for comingSoon cards
  loading?: boolean;
}

export default function PlanCard({
  plan,
  selected,
  onSelect,
  onNotify,
  loading = false,
}: PlanCardProps) {
  const { recommended, comingSoon } = plan;

  return (
    <div
      className={cn(
        'relative rounded-3xl border bg-white transition-all duration-200',
        recommended
          ? 'border-2 border-warm-brown shadow-hover'
          : selected
          ? 'border-2 border-warm-brown/50 shadow-card'
          : 'border border-beige shadow-card hover:border-soft-brown/40',
        comingSoon && 'cursor-default',
      )}
    >
      {/* Recommended ribbon */}
      {recommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-warm-brown text-white text-xs font-semibold shadow-sm whitespace-nowrap">
            가장 인기 ⭐
          </span>
        </div>
      )}

      {/* Coming soon tag */}
      {comingSoon && plan.tag && (
        <div className="absolute top-4 right-4">
          <span className="px-2.5 py-1 rounded-full bg-soft-brown/15 text-soft-brown text-[11px] font-medium">
            {plan.tag}
          </span>
        </div>
      )}

      {/* Main content — dimmed when comingSoon */}
      <div className={cn('p-6', comingSoon && 'opacity-50')}>
        {/* Tag (non-comingSoon) */}
        {plan.tag && !comingSoon && (
          <span className="inline-block text-xs font-medium text-warm-brown bg-warm-brown/10 px-3 py-1 rounded-full mb-3">
            {plan.tag}
          </span>
        )}

        {/* Name + Price row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <h3 className="font-serif text-xl text-deep-brown font-semibold leading-tight">
            {plan.name}
          </h3>
          <div className="text-right shrink-0">
            {plan.originalPrice !== undefined && (
              <p className="text-soft-brown/60 text-xs line-through mb-0.5">
                ₩{plan.originalPrice.toLocaleString('ko-KR')}
              </p>
            )}
            <p className="font-serif text-2xl text-deep-brown font-bold leading-none">
              {plan.price === 0 ? '무료' : `₩${plan.price.toLocaleString('ko-KR')}`}
            </p>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-5">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-soft-brown">
              <Check className="w-4 h-4 text-warm-brown flex-shrink-0" strokeWidth={2.5} />
              {f}
            </li>
          ))}
        </ul>

        {/* Note */}
        {plan.note && (
          <p className="text-soft-brown/60 text-xs mb-4">{plan.note}</p>
        )}
      </div>

      {/* CTA Button — always full opacity */}
      <div className={cn('px-6 pb-6', comingSoon ? '' : '-mt-2')}>
        <button
          type="button"
          disabled={loading}
          onClick={comingSoon ? onNotify : onSelect}
          className={cn(
            'w-full py-3.5 rounded-full text-sm font-medium',
            'transition-all duration-200 active:scale-[0.97]',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            comingSoon
              ? 'border border-soft-brown/30 text-soft-brown hover:bg-beige'
              : recommended
              ? 'bg-warm-brown text-white hover:bg-deep-brown hover:shadow-hover'
              : plan.price === 0
              ? 'bg-beige text-warm-brown border border-soft-brown/30 hover:bg-soft-brown/20'
              : 'bg-deep-brown/8 text-deep-brown border border-deep-brown/20 hover:bg-deep-brown/15',
          )}
          style={
            !comingSoon && !recommended && plan.price !== 0
              ? { backgroundColor: 'rgba(74,47,26,0.06)' }
              : undefined
          }
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              처리 중…
            </span>
          ) : (
            plan.ctaLabel
          )}
        </button>
      </div>
    </div>
  );
}
