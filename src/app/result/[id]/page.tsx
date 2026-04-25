'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Download, Link2, Share2, RotateCcw, Archive } from 'lucide-react';
import { usePetStore } from '@/store/petStore';
import { useToast } from '@/components/ui/Toast';
import ImageCarousel from '@/components/result/ImageCarousel';
import StorySection, { type StoryResult } from '@/components/result/StorySection';
import ShareCard from '@/components/result/ShareCard';
import ArchiveModal from '@/components/result/ArchiveModal';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseStory(raw: string): StoryResult | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoryResult;
  } catch {
    // Legacy plain-string format
    return { title: '', story: raw, wishMessage: '', closingLine: '', shareText: raw.slice(0, 60) };
  }
}

async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch {
    window.open(url, '_blank');
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

export default function ResultPage() {
  const router = useRouter();
  const toast = useToast();
  const { generatedImages, generatedStory, petInfo, selectedPlan, reset } = usePetStore();
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const name = petInfo.name || '소중한 아이';
  const story = parseStory(generatedStory);
  const isFree = selectedPlan === 'free';
  const isPaid = selectedPlan === 'basic' || selectedPlan === 'premium';

  // ── Empty state ─────────────────────────────────────────────────────────────

  if (!generatedImages.length) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center gap-4">
        <p className="font-serif text-xl text-deep-brown">결과를 찾을 수 없어요.</p>
        <p className="text-soft-brown text-sm">처음부터 다시 시작해주세요.</p>
        <Link
          href="/upload"
          className="mt-2 px-6 py-3 rounded-full bg-warm-brown text-white text-sm font-medium hover:bg-deep-brown transition-colors"
        >
          다시 시작하기
        </Link>
      </div>
    );
  }

  // ── Share card download (html2canvas) ────────────────────────────────────────

  const handleShareCardDownload = async () => {
    if (!shareCardRef.current) return;
    setDownloading(true);
    try {
      // Dynamic import so SSR is never affected
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(shareCardRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#FAF7F2',
      });
      const a = document.createElement('a');
      a.download = `${name}_babypet_share.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch {
      // Fallback: download the first raw image
      await downloadImage(generatedImages[0], `${name}_babypet.png`);
    } finally {
      setDownloading(false);
    }
  };

  // ── Copy link ────────────────────────────────────────────────────────────────

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('링크가 복사됐어요 🔗');
    } catch {
      toast.error('링크 복사에 실패했어요.');
    }
  };

  // ── Native share ─────────────────────────────────────────────────────────────

  const handleShare = async () => {
    const shareData = {
      title: `${name}의 아기 시절`,
      text: story?.shareText ?? `${name}의 아기 시절을 AI로 상상해봤어요 🐾`,
      url: window.location.href,
    };
    if (navigator.share && navigator.canShare?.(shareData)) {
      await navigator.share(shareData);
    } else {
      await handleCopyLink();
    }
  };

  // ── Reset ────────────────────────────────────────────────────────────────────

  const handleReset = () => {
    reset();
    router.push('/');
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Hidden share card — captured by html2canvas */}
      {story && (
        <ShareCard
          ref={shareCardRef}
          imageUrl={generatedImages[0]}
          petName={name}
          shareText={story.shareText}
        />
      )}

      <div className="min-h-screen bg-cream">
        <div className="max-w-lg mx-auto px-4 pt-8 pb-28 space-y-6">

          {/* ── Ethical disclaimer ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <span className="text-[11px] text-soft-brown/60 bg-soft-brown/8 px-3 py-1.5 rounded-full border border-soft-brown/15">
              AI 상상 복원 이미지 · 실제 사진이 아닙니다
            </span>
          </motion.div>

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="text-center"
          >
            <p className="text-warm-brown text-xs tracking-widest uppercase mb-2 font-medium">
              아기 시절 복원 완료
            </p>
            <h1 className="font-serif text-2xl text-deep-brown font-semibold leading-snug">
              {name}의 첫 번째 시간을
              <br />
              만나보세요 🐾
            </h1>
          </motion.div>

          {/* ── Image(s) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease }}
          >
            <ImageCarousel images={generatedImages} petName={name} />
          </motion.div>

          {/* ── Story ── */}
          {story && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease }}
            >
              <StorySection
                story={story}
                petName={name}
                isFree={isFree}
                onUpgrade={() => router.push('/select')}
              />
            </motion.div>
          )}

          {/* ── Donation badge (paid only) ── */}
          {isPaid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25, ease }}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-warm-brown/25 bg-warm-brown/5"
            >
              <span className="text-xl shrink-0" aria-hidden="true">🐾</span>
              <p className="text-warm-brown text-sm font-medium leading-snug">
                이 구매의 2%가 유기동물 보호를 위해
                <br />
                <span className="font-normal text-soft-brown">함께해 주셔서 감사해요.</span>
              </p>
            </motion.div>
          )}

          {/* ── Share section ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28, ease }}
            className="space-y-3"
          >
            <p className="text-center text-soft-brown text-sm font-medium">
              이 아이의 시간을 공유해보세요
            </p>

            <div className="grid grid-cols-3 gap-3">
              {/* Download share card */}
              <button
                type="button"
                onClick={handleShareCardDownload}
                disabled={downloading}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-white border border-beige shadow-card hover:border-soft-brown/40 hover:shadow-hover transition-all duration-200 disabled:opacity-60"
              >
                <Download className="w-5 h-5 text-warm-brown" />
                <span className="text-[11px] text-soft-brown font-medium leading-tight text-center">
                  {downloading ? '저장 중…' : '이미지\n저장'}
                </span>
              </button>

              {/* Native share / SNS */}
              <button
                type="button"
                onClick={handleShare}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-white border border-beige shadow-card hover:border-soft-brown/40 hover:shadow-hover transition-all duration-200"
              >
                <Share2 className="w-5 h-5 text-warm-brown" />
                <span className="text-[11px] text-soft-brown font-medium leading-tight text-center">
                  SNS<br />공유
                </span>
              </button>

              {/* Copy link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-white border border-beige shadow-card hover:border-soft-brown/40 hover:shadow-hover transition-all duration-200"
              >
                <Link2 className="w-5 h-5 text-warm-brown" />
                <span className="text-[11px] text-soft-brown font-medium leading-tight text-center">
                  링크<br />복사
                </span>
              </button>
            </div>
          </motion.div>

          {/* ── Upgrade banner (Free / Basic) ── */}
          {!isPaid || isFree ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.32, ease }}
              className="rounded-3xl bg-deep-brown/5 border border-deep-brown/10 px-6 py-5 text-center"
            >
              <p className="font-serif text-deep-brown font-semibold mb-1">
                더 많은 모습이 궁금하신가요?
              </p>
              <p className="text-soft-brown text-sm leading-relaxed mb-4">
                Premium으로 업그레이드하면 3가지 스타일의 이미지와
                <br />
                확장 스토리를 받아볼 수 있어요.
              </p>
              <Link
                href="/select"
                className="inline-flex items-center px-7 py-3 rounded-full bg-warm-brown text-white text-sm font-medium hover:bg-deep-brown transition-colors duration-200"
              >
                Premium으로 업그레이드
              </Link>
            </motion.div>
          ) : null}

          {/* ── Archive save ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.36, ease }}
          >
            <button
              type="button"
              onClick={() => setArchiveOpen(true)}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl border border-soft-brown/30 text-soft-brown text-sm font-medium hover:bg-beige hover:text-warm-brown transition-all duration-200"
            >
              <Archive className="w-4 h-4" />
              {name}의 기억 아카이브에 저장하기
            </button>
          </motion.div>

          {/* ── Reset ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4, ease }}
            className="text-center"
          >
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-soft-brown/60 text-xs hover:text-soft-brown transition-colors duration-150"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              처음부터 다시 만들기
            </button>
          </motion.div>
        </div>
      </div>

      {/* Archive modal */}
      <ArchiveModal
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        petName={name}
      />
    </>
  );
}
