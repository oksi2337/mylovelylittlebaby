'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import StepIndicator from '@/components/ui/StepIndicator';
import PhotoUploader from '@/components/upload/PhotoUploader';
import { cn } from '@/lib/utils';

// ─── Guide data ───────────────────────────────────────────────────────────────

const GOOD = [
  '얼굴 전체가 보이는 사진',
  '밝은 조명에서 찍은 사진',
  '1마리만 있는 사진',
];

const BAD = [
  '너무 멀리서 찍은 사진',
  '어둡거나 흔들린 사진',
  '여러 동물이 함께 있는 사진',
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UploadPage() {
  const router = useRouter();
  const photoPreviewUrl = usePetStore((s) => s.photoPreviewUrl);
  const hasPhoto = Boolean(photoPreviewUrl);

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-24">

        {/* ── Top row: back + donation badge ── */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-soft-brown text-sm hover:text-warm-brown transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            처음으로
          </Link>

          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-beige">
            <div className="text-center leading-tight" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              <p className="text-warm-brown font-semibold text-xs">2%</p>
              <p className="text-warm-brown text-[10px]">기부중</p>
            </div>
          </div>
        </div>

        {/* ── Step indicator ── */}
        <StepIndicator currentStep={1} totalSteps={3} labels={['사진 업로드', '정보 입력', '플랜 선택']} />

        {/* ── Title ── */}
        <div className="mb-8">
          <h1 className="font-serif text-2xl md:text-[1.75rem] text-deep-brown font-semibold leading-snug mb-2">
            아이의 사진을 올려주세요
          </h1>
          <p className="text-soft-brown text-[0.95rem] leading-relaxed">
            얼굴이 잘 보이는 사진일수록 더 자연스럽게 복원돼요.
          </p>
        </div>

        {/* ── Upload zone ── */}
        <PhotoUploader />

        {/* ── Guide section ── */}
        <div className="mt-6 rounded-3xl border border-beige bg-white p-5 md:p-6">
          <p className="text-deep-brown text-sm font-semibold mb-4">좋은 사진 예시</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {/* Good */}
            <ul className="space-y-2">
              {GOOD.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-deep-brown">
                  <span className="text-green-500 text-base leading-[1.4] flex-shrink-0">✅</span>
                  <span className="leading-[1.55]">{item}</span>
                </li>
              ))}
            </ul>

            {/* Bad */}
            <ul className="space-y-2 mt-2 sm:mt-0">
              {BAD.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-soft-brown">
                  <span className="text-red-400 text-base leading-[1.4] flex-shrink-0">❌</span>
                  <span className="leading-[1.55]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-6">
          <button
            type="button"
            disabled={!hasPhoto}
            onClick={() => router.push('/info')}
            className={cn(
              'w-full py-4 rounded-full text-base font-medium',
              'transition-all duration-200',
              hasPhoto
                ? [
                    'bg-warm-brown text-white',
                    'hover:bg-deep-brown hover:scale-[1.01] hover:shadow-hover',
                    'active:scale-[0.98]',
                  ].join(' ')
                : 'bg-soft-brown/20 text-soft-brown/50 cursor-not-allowed',
            )}
            aria-disabled={!hasPhoto}
          >
            {hasPhoto ? '다음으로 →' : '사진을 먼저 선택해주세요'}
          </button>
        </div>
      </div>
    </div>
  );
}
