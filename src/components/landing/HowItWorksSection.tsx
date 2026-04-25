'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const STEPS = [
  {
    num: '01',
    icon: '📸',
    title: '반려동물 사진 업로드',
    desc: '얼굴이 잘 보이는 선명한 현재 사진을 올려주세요.',
  },
  {
    num: '02',
    icon: '✏️',
    title: '아이 정보 입력',
    desc: '아이의 성격과 좋아하는 장소를 알려주시면 더 닮은 모습으로 복원돼요.',
  },
  {
    num: '03',
    icon: '✨',
    title: '아기 시절을 상상 복원',
    desc: 'AI가 현재 특징을 분석해 아기 시절 이미지를 생성합니다.',
  },
];

const RESULT = {
  icon: '🎁',
  title: '이미지 + 감성 스토리 수령',
  desc: '복원 이미지와 따뜻한 감성 스토리를 함께 받아보세요.',
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="bg-beige py-24 md:py-32 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-[26px] md:text-[38px] text-deep-brown font-semibold leading-[1.3]">
            이용 방법
          </h2>
          <p className="text-soft-brown mt-4 text-base">
            딱 세 단계로 완성됩니다
          </p>
        </motion.div>

        {/* Steps + Arrow + Result */}
        <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-3">

          {/* 3 Step cards */}
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease }}
              className="relative flex-1"
            >
              {/* Connector line between steps (desktop only) */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-[22px] left-[calc(50%+28px)] right-[-50%] h-[1px] bg-soft-brown/25 z-0" />
              )}

              <div className="relative z-10 bg-white rounded-3xl p-6 shadow-card border border-soft-brown/10 flex md:flex-col gap-5 md:gap-4 items-start md:items-center text-left md:text-center h-full">
                <div className="flex-shrink-0 flex md:flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-warm-brown flex items-center justify-center text-white font-bold text-sm">
                    {step.num}
                  </div>
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <div>
                  <h3 className="font-serif text-[1rem] md:text-[1.05rem] text-deep-brown font-semibold mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-soft-brown text-[0.875rem] leading-[1.85]">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.45, ease }}
            className="flex items-center justify-center flex-shrink-0"
          >
            <span className="text-warm-brown text-2xl font-bold md:rotate-0 rotate-90 select-none">
              →
            </span>
          </motion.div>

          {/* Result card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55, ease }}
            className="relative flex-1"
          >
            <div className="relative z-10 bg-white rounded-3xl p-6 shadow-card border border-soft-brown/10 flex md:flex-col gap-5 md:gap-4 items-start md:items-center text-left md:text-center h-full">
              <div className="flex-shrink-0 flex md:flex-col items-center gap-2">
                <div className="w-11 h-11 rounded-full bg-warm-brown flex items-center justify-center text-white font-bold text-sm">
                  🎁
                </div>
              </div>
              <div>
                <h3 className="font-serif text-[1rem] md:text-[1.05rem] text-deep-brown font-semibold mb-2 leading-snug">
                  {RESULT.title}
                </h3>
                <p className="text-soft-brown text-[0.875rem] leading-[1.85]">
                  {RESULT.desc}
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
