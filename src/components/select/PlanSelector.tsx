'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { usePetStore } from '@/store/petStore';
import { useToast } from '@/components/ui/Toast';
import { requestTossPayment, generateOrderId } from '@/lib/toss';
import PetSummaryCard from './PetSummaryCard';
import PlanCard, { type PlanConfig } from './PlanCard';
import NotifyModal from './NotifyModal';

// ─── Plan data ─────────────────────────────────────────────────────────────────

const PLANS: PlanConfig[] = [
  {
    id: 'free',
    tag: '무료 체험',
    name: '무료로 먼저 만나보기',
    price: 0,
    features: [
      '아기 시절 상상 이미지 1장',
      '짧은 감성 문구',
      '기본 공유 카드',
    ],
    note: '결과 확인 후 언제든 업그레이드 가능',
    ctaLabel: '무료로 먼저 받아보기',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 4900,
    features: [
      '아기 시절 상상 이미지 1장',
      '감성 스토리 (전체)',
      '고화질 다운로드',
      '공유 카드',
      '🐾 기부 적립 배지',
    ],
    ctaLabel: 'Basic 시작하기',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 14900,
    originalPrice: 19900,
    features: [
      '아기 시절 상상 이미지 3장',
      '확장 감성 스토리',
      '다양한 스타일 선택',
      '고화질 다운로드',
      '공유 카드',
      '🐾 기부 적립 배지',
    ],
    ctaLabel: 'Premium 시작하기',
    recommended: true,
  },
  {
    id: 'memory',
    tag: 'Coming Soon',
    name: 'Memory Pack',
    price: 29000,
    features: [
      '이미지 5장',
      '영상 콘텐츠',
      '기념일 카드',
    ],
    ctaLabel: '출시 알림 받기',
    comingSoon: true,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlanSelector() {
  const router = useRouter();
  const toast = useToast();
  const { selectedPlan, setSelectedPlan, petInfo } = usePetStore();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const handleSelect = async (plan: PlanConfig) => {
    if (plan.comingSoon) return;

    setSelectedPlan(plan.id as 'free' | 'basic' | 'premium' | 'memory');

    // Free: go straight to generating
    if (plan.price === 0) {
      router.push('/generating');
      return;
    }

    // Paid plans: TossPayments
    setLoadingPlanId(plan.id);
    try {
      await requestTossPayment({
        amount: plan.price,
        orderId: generateOrderId(),
        orderName: `반려동물 아기 시절 복원 - ${plan.name}`,
        successUrl: `${window.location.origin}/generating`,
        failUrl: `${window.location.origin}/select`,
      });
      // requestPayment redirects; code below only runs on popup-mode cancel
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '결제 중 오류가 발생했어요.';
      toast.error(msg);
    } finally {
      setLoadingPlanId(null);
    }
  };

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <>
      <div className="space-y-4">
        {/* ── Pet summary ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <PetSummaryCard />
        </motion.div>

        {/* ── Plan cards ── */}
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease }}
            // Extra top padding for recommended card to make space for ribbon
            className={plan.recommended ? 'pt-4' : ''}
          >
            <PlanCard
              plan={plan}
              selected={selectedPlan === plan.id}
              loading={loadingPlanId === plan.id}
              onSelect={() => handleSelect(plan)}
              onNotify={() => setNotifyOpen(true)}
            />
          </motion.div>
        ))}

        {/* ── Donation banner ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease }}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-warm-brown/8 border border-warm-brown/15"
          style={{ backgroundColor: 'rgba(139,102,81,0.07)' }}
        >
          <span className="text-base" aria-hidden="true">🐾</span>
          <p className="text-warm-brown text-sm font-medium">
            결제 금액의 2%는 유기동물 보호를 위해 기부됩니다.
          </p>
        </motion.div>
      </div>

      {/* Memory Pack notify modal */}
      <NotifyModal open={notifyOpen} onClose={() => setNotifyOpen(false)} />
    </>
  );
}
