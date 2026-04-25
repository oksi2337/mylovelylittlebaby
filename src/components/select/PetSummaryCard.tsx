'use client';

import { usePetStore } from '@/store/petStore';

const TYPE_LABEL: Record<string, string> = {
  dog: '🐶 강아지',
  cat: '🐱 고양이',
  other: '🐾 기타',
};

export default function PetSummaryCard() {
  const { petInfo, photoPreviewUrls } = usePetStore();
  const firstPhoto = photoPreviewUrls[0];

  return (
    <div className="bg-white border border-beige rounded-3xl shadow-card px-5 py-4 flex items-center gap-4">
      {/* Photo thumbnail */}
      <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-beige">
        {firstPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstPhoto}
            alt={petInfo.name || '반려동물'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl select-none">
            {TYPE_LABEL[petInfo.type]?.charAt(0) ?? '🐾'}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <p className="font-serif text-deep-brown font-semibold text-[1rem] truncate">
            {petInfo.name || '이름 미입력'}
          </p>
          <span className="text-soft-brown text-xs shrink-0">
            {TYPE_LABEL[petInfo.type]}
          </span>
        </div>

        {petInfo.personality.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {petInfo.personality.map((trait) => (
              <span
                key={trait}
                className="px-2.5 py-0.5 rounded-full bg-beige border border-soft-brown/20 text-soft-brown text-[11px] font-medium"
              >
                {trait}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-soft-brown/50 text-xs">성격 정보 없음</p>
        )}
      </div>
    </div>
  );
}
