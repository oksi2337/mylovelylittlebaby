'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const CARDS = [
  {
    icon: '📷',
    title: '어릴 때 모습을 알 수 없어요',
    desc: '유기견 보호소에서 데려와서 아기 시절 사진이 없습니다. 우리 아이가 어떤 모습이었는지 영영 알 수 없다는 게 늘 아쉬워요.',
  },
  {
    icon: '📔',
    title: '추억할 사진이 단 한 장도 없어요',
    desc: '다른 보호자들은 강아지 때부터 앨범이 가득한데, 우리 아이의 앨범은 입양일부터 시작됩니다. 그 이전의 빈 페이지가 마음에 걸려요.',
  },
  {
    icon: '💭',
    title: '"조금만 더 일찍 만났더라면"',
    desc: '지금 이렇게 사랑스러운 아이인데, 아기였을 땐 얼마나 더 귀여웠을까. 그 시절을 함께하지 못했다는 아쉬움이 문득문득 찾아와요.',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-cream py-24 md:py-32 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-14 md:mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-soft-brown/12 border border-soft-brown/20 text-soft-brown text-sm mb-7"
            style={{ backgroundColor: 'rgba(196,168,130,0.12)' }}
          >
            <span className="text-[13px]">ⓘ</span>
            <span>유기동물 보호자라면 한 번쯤 느꼈을 것</span>
          </div>

          <h2 className="font-serif text-[28px] md:text-[40px] text-deep-brown font-semibold leading-[1.3] tracking-tight">
            아기 시절을 모른 채
            <br />
            함께 살아가고 있지 않나요?
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15 + i * 0.12, ease }}
              className="bg-white border border-beige rounded-3xl p-7 shadow-card flex flex-col h-full"
            >
              {/* Icon */}
              <div className="text-4xl mb-5 leading-none">{card.icon}</div>

              {/* Title */}
              <h3 className="font-serif text-lg text-deep-brown font-semibold mb-3 leading-snug">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-soft-brown text-[0.925rem] leading-[1.9]">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
