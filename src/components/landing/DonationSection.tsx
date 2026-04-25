'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const STATS = [
  { value: '2%', label: '모든 결제의 기부 비율' },
  { value: '월 1회', label: '기부 리포트 발행' },
  { value: '기부', label: '유기동물 보호에 사용' },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function DonationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="bg-beige py-20 md:py-28 px-4" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border border-soft-brown/15 shadow-card p-8 md:p-12">

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.55, ease }}
            className="text-5xl mb-6 text-center select-none"
            aria-hidden="true"
          >
            🐾
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1, ease }}
            className="text-center mb-10"
          >
            <h2 className="font-serif text-[22px] md:text-[30px] text-deep-brown font-semibold leading-[1.4] mb-4">
              결제 금액의 2%는
              <br />
              유기동물 보호를 위해 기부됩니다
            </h2>
            <p className="text-soft-brown text-[0.95rem] leading-[1.9] max-w-lg mx-auto">
              BabyPet을 이용할 때마다 유기동물 보호 단체에 소정의 금액이 자동으로
              기부됩니다. 아이의 아기 시절을 만나면서 동시에 또 다른 아이들의 미래를
              함께 만들어가세요.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.22, ease }}
            className="grid grid-cols-3 gap-4 mb-10"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-2xl bg-beige">
                <p className="font-serif text-2xl text-warm-brown font-bold mb-1">
                  {stat.value}
                </p>
                <p className="text-soft-brown text-xs leading-snug">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Report link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.35, ease }}
            className="text-center"
          >
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-warm-brown text-sm font-medium hover:text-deep-brown transition-colors underline underline-offset-4 decoration-warm-brown/40"
            >
              월별 기부 리포트 보기 →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
