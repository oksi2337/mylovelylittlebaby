'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePetStore } from '@/store/petStore';

// 클라이언트에서 File → 512px JPEG base64로 리사이즈
async function resizeToBase64(file: File, maxSize = 512): Promise<string> {
  const url = URL.createObjectURL(file);
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
  const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * ratio);
  canvas.height = Math.round(img.height * ratio);
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  return canvas.toDataURL('image/jpeg', 0.85);
}

export default function GeneratingPage() {
  const router = useRouter();
  const { photos, photoPreviewUrls, petInfo, selectedPlan, setResult } = usePetStore();
  const [msgIndex, setMsgIndex] = useState(0);
  const [error, setError] = useState(false);
  const started = useRef(false);

  const name = petInfo.name || '소중한 아이';
  const previewUrl = photoPreviewUrls[0] ?? null;

  const messages = [
    '아이의 작은 시절을 조심스럽게 상상하고 있어요.',
    '털빛과 눈빛을 기억하며 복원 중입니다.',
    '우리가 만나기 전의 시간을 그리고 있어요.',
    `${name}의 첫 번째 시간을 만들고 있어요.`,
  ];

  async function generate() {
    setError(false);
    try {
      // File 객체가 있으면 사진을 base64로 변환해서 API에 전달
      const photoBase64s: string[] = photos.length > 0
        ? await Promise.all(photos.map((f) => resizeToBase64(f)))
        : [];

      const [imageData, storyData] = await Promise.all([
        fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ petInfo, plan: selectedPlan, photoBase64s }),
        }).then((r) => r.json()),
        fetch('/api/generate-story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ petInfo, plan: selectedPlan }),
        }).then((r) => r.json()),
      ]);

      if (imageData.error || storyData.error) {
        throw new Error(imageData.error ?? storyData.error);
      }

      const { images, id } = imageData as { images: string[]; id: string };
      const { story } = storyData;

      setResult(images, typeof story === 'string' ? story : JSON.stringify(story), id);
      router.push(`/result/${id}`);
    } catch (err) {
      console.error('Generation failed:', err);
      setError(true);
    }
  }

  // StrictMode 이중 실행 방지
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    generate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 메시지 순환
  useEffect(() => {
    if (error) return;
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % messages.length), 3500);
    return () => clearInterval(id);
  }, [error, messages.length]);

  // ── 에러 상태 ─────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-xs w-full space-y-6">
          <span className="text-5xl block" aria-hidden="true">😢</span>
          <div>
            <h2 className="font-serif text-xl text-deep-brown font-semibold mb-2">
              앗, 잠시 문제가 발생했어요.
            </h2>
            <p className="text-soft-brown text-sm leading-relaxed">
              일시적인 오류일 수 있어요.<br />
              다시 시도해보세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => generate()}
            className="w-full py-3.5 rounded-full bg-warm-brown text-white text-sm font-medium hover:bg-deep-brown transition-colors duration-200"
          >
            다시 시도하기
          </button>
          <Link
            href="/"
            className="block text-soft-brown/70 text-sm hover:text-warm-brown transition-colors duration-150"
          >
            처음으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // ── 로딩 상태 ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Breathing background gradients */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(139,102,81,0.07) 0%, transparent 68%)',
        }}
        animate={{ scale: [1, 1.09, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 280,
          height: 280,
          background: 'radial-gradient(circle, rgba(139,102,81,0.11) 0%, transparent 65%)',
        }}
        animate={{ scale: [1, 1.14, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">

        {/* 첫 번째 사진 + pulsing ring */}
        <div className="relative mb-9">
          <motion.div
            className="absolute -inset-3 rounded-full border border-warm-brown/25"
            animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-[0_8px_32px_rgba(139,102,81,0.22)]">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-beige flex items-center justify-center text-3xl select-none">
                🐾
              </div>
            )}
          </div>
        </div>

        {/* Bouncing dots */}
        <div className="flex items-center gap-1.5 mb-8">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-2 h-2 rounded-full bg-warm-brown"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.75,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Rotating message */}
        <div className="h-10 flex items-center justify-center w-full px-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="text-soft-brown text-sm leading-relaxed"
            >
              {messages[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Bottom hint */}
        <p className="text-soft-brown/45 text-xs mt-10 leading-relaxed">
          평균 15~30초 정도 소요돼요.
          <br />
          잠시만 기다려주세요.
        </p>
      </div>
    </div>
  );
}
