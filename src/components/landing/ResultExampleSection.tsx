'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const RESULTS = [
  {
    name: '초코',
    breed: '푸들 · 5살',
    quote: '처음 이 눈빛을 봤을 때부터 운명이었어요.',
    beforeImg: '/examples/푸들성견.jpg',
    afterImg: '/examples/푸들아기.jpg',
    beforeLabel: '현재',
    afterLabel: '아기 시절 (AI 복원)',
  },
  {
    name: '나비',
    breed: '코리안 숏헤어 · 3살',
    quote: '이런 모습이었을 거라고, 상상만 했었는데.',
    beforeImg: '/examples/고양이성묘.jpg',
    afterImg: '/examples/고양이아기2.jpg',
    beforeLabel: '현재',
    afterLabel: '아기 시절 (AI 복원)',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function ImageCard({
  src,
  label,
  accent,
}: {
  src: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="flex-1 flex flex-col gap-1.5">
      <div className="aspect-square rounded-2xl overflow-hidden relative">
        <Image src={src} alt={label} fill className="object-cover" sizes="200px" />
        {accent && (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/90 uppercase tracking-widest font-medium bg-warm-brown/60 px-2 py-0.5 rounded-full whitespace-nowrap">
            AI Restored
          </span>
        )}
      </div>
      <p className="text-center text-[11px] text-soft-brown font-medium tracking-wide">
        {label}
      </p>
    </div>
  );
}

function ResultCard({
  result,
  index,
  inView,
}: {
  result: (typeof RESULTS)[0];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 + index * 0.16, ease }}
      className="bg-white border border-beige rounded-3xl shadow-card overflow-hidden flex-1"
    >
      {/* Before / After images */}
      <div className="p-5 pb-0 flex gap-3">
        <ImageCard src={result.beforeImg} label={result.beforeLabel} />
        <div className="flex items-center flex-shrink-0 pb-5">
          <div className="w-7 h-7 rounded-full bg-warm-brown/10 flex items-center justify-center text-warm-brown text-sm">
            →
          </div>
        </div>
        <ImageCard src={result.afterImg} label={result.afterLabel} accent />
      </div>

      {/* Info */}
      <div className="p-5 pt-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="font-serif text-deep-brown font-semibold">{result.name}</span>
            <span className="text-soft-brown text-xs ml-2">{result.breed}</span>
          </div>
          <span
            className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium"
            style={{ backgroundColor: 'rgba(139,102,81,0.09)', color: '#7a5540' }}
          >
            🐾 기부 완료
          </span>
        </div>
        <p className="font-serif text-[0.9rem] text-soft-brown italic leading-relaxed">
          "{result.quote}"
        </p>
      </div>
    </motion.div>
  );
}

export default function ResultExampleSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="bg-cream py-24 md:py-32 px-4" ref={ref}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-[26px] md:text-[38px] text-deep-brown font-semibold leading-[1.3]">
            이런 결과를 받아보실 수 있어요
          </h2>
          <p className="text-soft-brown mt-4 text-base max-w-md mx-auto leading-relaxed">
            현재 사진 3장과 아이에 대한 정보를 바탕으로
            <br />
            아기시절 이미지를 생생하게 만들어드립니다
          </p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-5 md:gap-6">
          {RESULTS.map((result, i) => (
            <ResultCard key={result.name} result={result} index={i} inView={inView} />
          ))}
        </div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          className="text-center text-soft-brown/60 text-xs mt-6"
        >
          * 예시 이미지입니다. 실제 결과는 반려동물마다 다르게 생성됩니다.
        </motion.p>
      </div>
    </section>
  );
}
