import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StepIndicator from '@/components/ui/StepIndicator';
import PetInfoForm from '@/components/info/PetInfoForm';

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-28">

        {/* Back link */}
        <Link
          href="/upload"
          className="inline-flex items-center gap-1.5 text-soft-brown text-sm hover:text-warm-brown transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          사진 업로드
        </Link>

        {/* Step indicator */}
        <StepIndicator
          currentStep={2}
          totalSteps={3}
          labels={['사진 업로드', '정보 입력', '플랜 선택']}
        />

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-2xl md:text-[1.75rem] text-deep-brown font-semibold leading-snug mb-2">
            아이에 대해 알려주세요
          </h1>
          <p className="text-soft-brown text-[0.95rem] leading-relaxed">
            더 많이 알수록 더 자연스럽게 복원돼요.
          </p>
        </div>

        {/* Form */}
        <PetInfoForm />
      </div>
    </div>
  );
}
