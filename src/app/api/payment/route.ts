import { NextRequest, NextResponse } from 'next/server';
import type { Plan } from '@/types';
import { PLAN_DETAILS } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { plan, orderId } = (await req.json()) as {
      plan: Plan;
      orderId: string;
    };

    const planDetail = PLAN_DETAILS.find((p) => p.id === plan);
    if (!planDetail) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    if (plan === 'free') {
      return NextResponse.json({ success: true, orderId, amount: 0 });
    }

    // 실제 결제 연동 시 토스페이먼츠 또는 카카오페이 SDK 사용
    // 현재는 플레이스홀더 응답
    return NextResponse.json({
      success: true,
      orderId,
      amount: planDetail.price,
      paymentUrl: `https://payment-gateway.example.com/pay?order=${orderId}&amount=${planDetail.price}`,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}
