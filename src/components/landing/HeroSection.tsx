'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

// ─── Data ─────────────────────────────────────────────────────────────────────

const EXAMPLE_CARDS = [
  { img: '/examples/리트리버아기.jpg', name: '초코', desc: '리트리버 · 아기 시절', rotate: -5, z: 10, x: -8 },
  { img: '/examples/고양이아기.jpg',   name: '나비', desc: '고양이 · 아기 시절',   rotate: 0,  z: 20, x: 0  },
  { img: '/examples/말티즈아기.jpg',   name: '뭉치', desc: '말티즈 · 아기 시절',   rotate: 5,  z: 10, x: 8  },
];

const QUOTES = [
  '내가 몰랐던 시간을 처음으로 보네.',
  '만약 그때 너를 만났다면, 나는 어떤 말을 해줬을까?',
  '입양 전의 시간도 이제 우리의 이야기로 남길 수 있어.',
  '단 한 장의 사진이 하나의 기억이 되었다.',
];

// ─── Ease ─────────────────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function FloatQuote({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay: index * 0.08, ease }}
      className="py-10 md:py-12 border-b border-soft-brown/10 last:border-0"
    >
      <blockquote className="font-serif text-xl md:text-[1.65rem] text-deep-brown/75 text-center leading-relaxed tracking-tight" style={{ fontFamily: '"Nanum Myeongjo", Georgia, serif' }}>
        <span className="text-soft-brown/50 text-3xl align-top leading-none mr-1.5">"</span>
        {text}
        <span className="text-soft-brown/50 text-3xl align-bottom leading-none ml-1.5">"</span>
      </blockquote>
    </motion.div>
  );
}

function ExampleCard({
  img,
  name,
  desc,
  rotate,
  z,
  x,
  index,
}: (typeof EXAMPLE_CARDS)[0] & { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rotate * 0.5 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 0.65, delay: 0.75 + index * 0.12, ease }}
      style={{ zIndex: z, translateX: x }}
      className="relative flex-shrink-0 w-44 md:w-52"
    >
      <div className="rounded-[20px] overflow-hidden shadow-hover border-[3px] border-white relative">
        <div className="aspect-[3/4] relative">
          <Image src={img} alt={name} fill className="object-cover" sizes="208px" />
        </div>
        <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-deep-brown/70 to-transparent">
          <p className="text-white text-sm font-semibold">{name}</p>
          <p className="text-white/65 text-[11px]">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-cream overflow-hidden">
      {/* Grain overlay */}
      <div className="absolute inset-0 bg-grain-texture pointer-events-none opacity-70" />

      {/* Above-fold content */}
      <div className="relative max-w-3xl mx-auto px-4 pt-28 md:pt-40 pb-12 text-center">

        {/* Donation badge — above headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0, ease }}
          className="flex justify-center mb-7"
        >
          <span
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: 'rgba(139,102,81,0.11)', color: '#7a5540' }}
          >
            ♡&nbsp;수익의 2%가 유기동물 보호를 위해 기부됩니다
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.18, ease }}
          className="font-serif text-[36px] md:text-[56px] text-deep-brown font-semibold leading-[1.25] tracking-tight mb-6"
        >
          우리가 만나기 전,
          <br />
          <span className="text-warm-brown">너는 어떤 모습이었을까?</span>
        </motion.h1>

        {/* Sub copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.33, ease }}
          className="text-soft-brown text-base md:text-[1.1rem] leading-[1.85] mb-10 md:mb-12 max-w-md mx-auto"
        >
          반려동물의 사진을 올리면
          <br />
          아기시절을 상상 복원해 드립니다.
        </motion.p>

        {/* CTA group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.6, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/upload" className="w-full sm:w-auto">
            <button
              className={[
                'w-full sm:w-auto sm:px-10 py-4 text-base font-medium',
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.78 }}
          className="mt-4"
        >
          <Link
            href="/select"
            className="text-soft-brown text-sm hover:text-warm-brown transition-colors"
          >
            프리미엄으로 더 많은 모습 보기 →
          </Link>
        </motion.div>
      </div>

      {/* Example cards — fan layout on desktop, scroll on mobile */}
      <div className="relative pb-20 md:pb-24">
        {/* Mobile: horizontal scroll */}
        <div className="flex md:hidden gap-4 px-6 overflow-x-auto scrollbar-hide">
          {EXAMPLE_CARDS.map((card, i) => (
            <div key={card.name} className="flex-shrink-0 w-44">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + i * 0.1, ease }}
              >
                <div className="rounded-[20px] overflow-hidden shadow-hover border-[3px] border-white relative">
                  <div className="aspect-[3/4] relative">
                    <Image src={card.img} alt={card.name} fill className="object-cover" sizes="176px" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 px-3 py-2.5 bg-gradient-to-t from-deep-brown/70 to-transparent">
                    <p className="text-white text-sm font-semibold">{card.name}</p>
                    <p className="text-white/65 text-[11px]">{card.desc}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Desktop: overlapping fan */}
        <div className="hidden md:flex items-end justify-center h-72 relative">
          {EXAMPLE_CARDS.map((card, i) => (
            <ExampleCard key={card.name} {...card} index={i} />
          ))}
        </div>
      </div>

      {/* Floating quotes — scroll-triggered */}
      <div className="max-w-2xl mx-auto px-4 pb-24">
        {QUOTES.map((text, i) => (
          <FloatQuote key={i} text={text} index={i} />
        ))}
      </div>
    </section>
  );
}
