'use client';

import { Lock } from 'lucide-react';

export interface StoryResult {
  title: string;
  story: string;
  wishMessage: string;
  closingLine: string;
  shareText: string;
}

interface StorySectionProps {
  story: StoryResult;
  petName: string;
  isFree: boolean;
  onUpgrade: () => void;
}

export default function StorySection({
  story,
  petName,
  isFree,
  onUpgrade,
}: StorySectionProps) {
  return (
    <div
      className="rounded-3xl p-6 border border-soft-brown/20"
      style={{ backgroundColor: 'var(--color-beige)' }}
    >
      {/* Title */}
      <h2 className="font-serif text-base text-warm-brown font-semibold mb-5 tracking-wide">
        {story.title || `${petName}의 첫 시간`}
      </h2>

      {/* Story body */}
      <div className="relative">
        <p className="font-serif text-deep-brown text-[0.95rem] leading-[1.95] whitespace-pre-line">
          {story.story}
        </p>

        {/* Free-plan blur overlay */}
        {isFree && (
          <div className="absolute inset-0 top-[5.5rem] flex flex-col">
            <div className="h-12 bg-gradient-to-b from-transparent to-[#F0EBE0]" />
            <div className="flex-1 bg-[#F0EBE0] backdrop-blur-sm flex flex-col items-center justify-center gap-3 rounded-b-2xl">
              <div className="flex items-center gap-2 text-soft-brown">
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">전체 스토리는 유료 플랜에서 볼 수 있어요</span>
              </div>
              <button
                type="button"
                onClick={onUpgrade}
                className="px-6 py-2.5 rounded-full bg-warm-brown text-white text-sm font-medium hover:bg-deep-brown transition-colors duration-200"
              >
                전체 스토리 보기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wish message + closing — paid only */}
      {!isFree && (
        <>
          <hr className="border-soft-brown/20 my-6" />

          {story.wishMessage && (
            <blockquote className="font-serif text-soft-brown italic leading-relaxed text-sm mb-5 pl-4 border-l-2 border-warm-brown/30">
              {story.wishMessage}
            </blockquote>
          )}

          {story.closingLine && (
            <p className="font-serif text-warm-brown text-sm font-semibold leading-relaxed">
              {story.closingLine}
            </p>
          )}
        </>
      )}
    </div>
  );
}
