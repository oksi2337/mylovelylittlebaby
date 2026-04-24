'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import DonationBadge from '@/components/ui/DonationBadge';

interface Plan {
  id: string;
  name: string;
  price: number;
  priceNote?: string;
  desc: string;
  features: string[];
  recommended?: boolean;
  ctaLabel: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: '무료 체험',
    price: 0,
    desc: '아기 시절을 처음 만나보고 싶다면',
    features: [
      'AI 생성 이미지 1장',
      '짧은 감성 문구',
      '공유 카드',
      '워터마크 포함',
    ],
    ctaLabel: '무료로 시작하기',
  },
  {
    id: 'basic',
    name: '베이직',
    price: 4900,
    desc: '소중한 추억을 제대로 간직하고 싶다면',
    features: [
      'AI 생성 이미지 1장',
      '감성 스토리',
      '공유 카드',
      '기부 배지',
      '워터마크 없음',
    ],
    ctaLabel: '베이직으로 시작',
  },
  {
    id: 'premium',
    name: '프리미엄',
    price: 14900,
    priceNote: '가장 인기',
    desc: '더 완성된 추억 앨범을 원한다면',
    features: [
      'AI 생성 이미지 3장',
      '확장 감성 스토리',
      '다양한 연령대 스타일',
      '고화질 다운로드',
      '공유 카드 · 기부 배지',
      '워터마크 없음',
    ],
    recommended: true,
    ctaLabel: '프리미엄으로 시작',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

function PriceCard({ plan, index, inView }: { plan: Plan; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.1 + index * 0.13, ease }}
      className={[
        'relative flex flex-col rounded-3xl border p-7 shadow-card transition-shadow duration-200 hover:shadow-hover',
        plan.recommended
          ? 'bg-white border-warm-brown border-2'
          : 'bg-white border-beige',
      ].join(' ')}
    >
      {/* "가장 인기" badge */}
      {plan.recommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-warm-brown text-white text-xs font-semibold shadow-sm whitespace-nowrap">
            가장 인기
          </span>
        </div>
      )}

      {/* Plan name + desc */}
      <div className="mb-6">
        <h3 className="font-serif text-xl text-deep-brown font-semibold mb-1.5">
          {plan.name}
        </h3>
        <p className="text-soft-brown text-sm leading-relaxed">{plan.desc}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        {plan.price === 0 ? (
          <p className="font-serif text-4xl text-deep-brown font-bold">무료</p>
        ) : (
          <p className="font-serif text-4xl text-deep-brown font-bold">
            {plan.price.toLocaleString('ko-KR')}
            <span className="text-xl font-normal text-soft-brown ml-1">원</span>
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-2.5 mb-7">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-soft-brown">
            <Check className="w-4 h-4 text-warm-brown flex-shrink-0" strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link href="/upload">
        <button
          className={[
            'w-full py-3.5 rounded-full text-sm font-medium',
            'transition-all duration-200 active:scale-[0.97]',
            plan.recommended
              ? 'bg-warm-brown text-white hover:bg-deep-brown hover:shadow-hover'
              : 'bg-beige text-warm-brown border border-soft-brown/30 hover:bg-soft-brown/20',
          ].join(' ')}
        >
          {plan.ctaLabel}
        </button>
      </Link>
    </motion.div>
  );
}

export default function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="bg-cream py-24 md:py-32 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-6"
        >
          <h2 className="font-serif text-[26px] md:text-[38px] text-deep-brown font-semibold leading-[1.3]">
            가격 안내
          </h2>
          <p className="text-soft-brown mt-4 text-base max-w-sm mx-auto leading-relaxed">
            무료로 먼저 체험해보세요. 카드 등록 불필요.
          </p>
        </motion.div>

        {/* Donation badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15, ease }}
          className="flex justify-center mb-12"
        >
          <DonationBadge size="md" />
        </motion.div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-5 items-start md:pt-4">
          {PLANS.map((plan, i) => (
            <PriceCard key={plan.id} plan={plan} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
