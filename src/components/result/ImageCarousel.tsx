'use client';

import { useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: string[];
  petName: string;
}

async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch {
    window.open(url, '_blank');
  }
}

export default function ImageCarousel({ images, petName }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIndex(index);
  };

  const isSingle = images.length === 1;

  return (
    <div className="w-full">
      {isSingle ? (
        /* ── Single image ── */
        <div className="relative max-w-xs mx-auto aspect-square rounded-[20px] overflow-hidden shadow-[0_8px_40px_rgba(74,47,26,0.18)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt={`${petName} 아기 시절`}
            className="w-full h-full object-cover"
          />

          {/* Name overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/45 to-transparent pt-12 pb-4 px-4">
            <p className="font-serif text-white text-center text-sm font-medium tracking-wide">
              {petName}
            </p>
          </div>

          {/* Download hover button */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => downloadImage(images[0], `${petName}_babypet_1.png`)}
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition-colors"
              aria-label="이미지 저장"
            >
              <Download className="w-4 h-4 text-deep-brown" />
            </button>
          </div>
        </div>
      ) : (
        /* ── Multi-image carousel ── */
        <>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4"
          >
            {images.map((url, i) => (
              <div
                key={i}
                className="group snap-center flex-none w-[260px] aspect-square rounded-[20px] overflow-hidden shadow-[0_8px_40px_rgba(74,47,26,0.18)] relative"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`${petName} 아기 시절 ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Name overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/45 to-transparent pt-10 pb-3 px-3">
                  <p className="font-serif text-white text-center text-xs font-medium">
                    {petName}
                  </p>
                </div>
                {/* Download button */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => downloadImage(url, `${petName}_babypet_${i + 1}.png`)}
                    className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm hover:bg-white transition-colors"
                    aria-label="이미지 저장"
                  >
                    <Download className="w-3.5 h-3.5 text-deep-brown" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === activeIndex
                    ? 'w-5 bg-warm-brown'
                    : 'w-1.5 bg-soft-brown/40',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
