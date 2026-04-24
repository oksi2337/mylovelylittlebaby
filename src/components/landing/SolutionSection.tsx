'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

const CARDS: { icon: string; iconBg: string; title: string; desc: React.ReactNode }[] = [
  {
    icon: '✨',
    iconBg: 'bg-amber-50',
    title: '지금의 모습으로 그려내는 어린 시절',
    desc: <>현재 아이의 눈빛, 털색, 고유한 특징을 AI가 정밀 분석하여, 단 한 번도 본 적 없는 가장 자연스럽고<br />사랑스러운 아기 시절의 모습을 재현합니다.</>,
  },
  {
    icon: '✍️',
    iconBg: 'bg-warm-brown/8',
    title: '만약 그때 만났다면 들려줬을 이야기',
    desc: <>"그때 만났다면 어떤 하루를 보냈을까?"라는 상상에서 시작된 따뜻한 편지와 이야기를 함께 담아드립니다.<br />이미지 그 이상의 깊은 감동을 경험해 보세요.</>,
  },
  {
    icon: '🎁',
    iconBg: 'bg-green-50',
    title: '영원히 간직될 우리만의 첫 번째 추억',
    desc: <>복원된 이미지와 스토리는 고화질 디지털 카드로 제작되어 언제든 꺼내 볼 수 있으며,<br />결제 금액의 일부는 다른 유기동물들을 위한 기부금으로 소중히 사용됩니다.</>,
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function SolutionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="bg-beige py-24 md:py-32 px-4" ref={ref}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-[26px] md:text-[38px] text-deep-brown font-semibold leading-[1.3] tracking-tight">
            이제 비어있던 첫 페이지를
            <br className="hidden md:block" />
            채워드릴게요
          </h2>
        </motion.div>

        {/* Vertical card stack */}
        <div className="flex flex-col gap-4">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15 + i * 0.14, ease }}
              className="bg-white rounded-3xl p-7 md:p-8 shadow-card border border-soft-brown/10 flex gap-5 md:gap-7 items-start"
            >
              {/* Icon block */}
              <div
                className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${card.iconBg}`}
                style={card.iconBg === 'bg-warm-brown/8' ? { backgroundColor: 'rgba(139,102,81,0.08)' } : undefined}
              >
                {card.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="font-serif text-lg md:text-xl text-deep-brown font-semibold mb-2.5 leading-snug">
                  {card.title}
                </h3>
                <p className="text-soft-brown text-[0.925rem] leading-[1.9]">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6, ease }}
          className="text-center mt-12"
        >
          <Link
            href="/upload"
            className={[
              'inline-flex items-center px-10 py-4 rounded-full text-base font-medium',
              'bg-warm-brown text-white shadow-sm',
              'transition-all duration-200 hover:bg-deep-brown hover:scale-[1.02] hover:shadow-hover',
              'active:scale-[0.97]',
            ].join(' ')}
          >
            무료로 1장 받아보기
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
