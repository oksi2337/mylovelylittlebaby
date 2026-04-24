import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StepIndicator from '@/components/ui/StepIndicator';
import PlanSelector from '@/components/select/PlanSelector';

export const metadata = {
  title: '플랜 선택 | BabyPet',
};

const STEP_LABELS = ['사진 업로드', '정보 입력', '플랜 선택'];

export default function SelectPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-28">
        {/* Back link */}
        <Link
          href="/info"
          className="inline-flex items-center gap-1.5 text-soft-brown text-sm hover:text-warm-brown transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          정보 입력
        </Link>

        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={3} totalSteps={3} labels={STEP_LABELS} />
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-serif text-2xl text-deep-brown font-semibold mb-2">
            어떻게 받아보시겠어요?
          </h1>
          <p className="text-soft-brown text-sm leading-relaxed">
            먼저 무료로 만나보고, 더 원하시면 업그레이드하세요.
          </p>
        </div>

        {/* Plan cards */}
        <PlanSelector />
      </div>
    </div>
  );
}
