'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

const ease = [0.22, 1, 0.36, 1] as const;

export default function AdoptionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      className="py-24 md:py-32 px-4"
      style={{ backgroundColor: 'var(--color-deep-brown)' }}
      ref={ref}
    >
      <div className="max-w-2xl mx-auto text-center">

        {/* Paw accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-5xl mb-8 select-none"
          aria-hidden="true"
        >
          🐾
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="font-serif text-[26px] md:text-[38px] text-white font-semibold leading-[1.35] mb-5"
        >
          유기동물 보호소에서
          <br />
          입양하셨나요?
        </motion.h2>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.22, ease }}
          className="text-white/65 text-base md:text-lg leading-[1.9] mb-10"
        >
          아이의 입양 전 시간을 처음으로 만나볼 수 있어요.
          <br className="hidden sm:block" />
          비어있던 첫 페이지를, 이제 함께 채워보세요.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.34, ease }}
        >
          <Link
            href="/upload"
            className={[
              'inline-flex items-center px-10 py-4 rounded-full text-base font-medium',
              'bg-white text-deep-brown',
              'transition-all duration-200',
              'hover:bg-cream hover:scale-[1.02] hover:shadow-lg',
              'active:scale-[0.97]',
            ].join(' ')}
          >
            입양 전 시간 복원하기 →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
