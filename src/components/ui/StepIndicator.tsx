import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  /** Override default step labels */
  labels?: string[];
}

const DEFAULT_LABELS = ['사진 업로드', '정보 입력', '플랜 선택', '생성 중', '결과'];

export default function StepIndicator({
  currentStep,
  totalSteps,
  labels = DEFAULT_LABELS,
}: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-4 mb-8" aria-label="진행 단계">
      {/* Step circles row */}
      <div className="flex items-center gap-0">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const step = i + 1;
          const done = step < currentStep;
          const active = step === currentStep;
          const upcoming = step > currentStep;

          return (
            <div key={step} className="flex items-center">
              {/* Circle */}
              <div
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
                  'border-2 transition-all duration-300',
                  done
                    ? 'bg-warm-brown border-warm-brown text-white'
                    : active
                    ? 'bg-white border-warm-brown text-warm-brown shadow-soft'
                    : 'bg-white border-soft-brown/30 text-soft-brown/50',
                )}
              >
                {done ? (
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  <span>{step}</span>
                )}
              </div>

              {/* Connector line (not after last) */}
              {step < totalSteps && (
                <div
                  className={cn(
                    'h-[2px] w-8 md:w-12 transition-all duration-300',
                    done ? 'bg-warm-brown' : 'bg-soft-brown/20',
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current step label */}
      <p className="text-sm text-soft-brown">
        <span className="font-medium text-warm-brown">{currentStep}</span>
        <span className="mx-1">/</span>
        <span>{totalSteps}</span>
        <span className="mx-2">—</span>
        <span>{labels[currentStep - 1] ?? ''}</span>
      </p>
    </div>
  );
}
