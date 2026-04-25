'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

const ease = [0.22, 1, 0.36, 1] as const;

export default function FinalCTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="bg-cream py-28 md:py-36 px-4" ref={ref}>
      <div className="max-w-2xl mx-auto text-center">

        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, ease }}
          className="h-[1px] w-16 bg-soft-brown/40 mx-auto mb-10 origin-left"
        />

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.1, ease }}
          className="font-serif text-[28px] md:text-[42px] text-deep-brown font-semibold leading-[1.3] mb-6"
        >
          지금 바로 아이의
          <br />
          첫 시간을 만나보세요.
        </motion.h2>

        {/* Sub text */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.22, ease }}
          className="text-soft-brown text-base md:text-lg leading-[1.85] mb-10"
        >
          무료로 먼저 체험해보세요.
          <br className="hidden sm:block" />
          카드 등록 없이 바로 시작할 수 있어요.
        </motion.p>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.34, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/upload" className="w-full sm:w-auto">
            <button
              className={[
                'w-full sm:w-auto sm:px-12 py-4 text-base font-medium',
                'bg-warm-brown text-white rounded-full',
                'shadow-sm transition-all duration-200',
                'hover:bg-deep-brown hover:scale-[1.02] hover:shadow-hover',
                'active:scale-[0.97]',
              ].join(' ')}
            >
              무료로 1장 받아보기
            </button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.48 }}
          className="mt-5 text-soft-brown/60 text-xs"
        >
          🐾 구매 시 수익의 2%가 유기동물 보호를 위해 기부됩니다
        </motion.p>
      </div>
    </section>
  );
}
