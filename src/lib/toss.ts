export function generateOrderId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 7);
  return `babypet-${ts}-${rand}`;
}

export interface TossPaymentOptions {
  amount: number;
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
}

export async function requestTossPayment(opts: TossPaymentOptions): Promise<void> {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  if (!clientKey) {
    throw new Error(
      'TossPayments 클라이언트 키가 설정되지 않았습니다.\n' +
        '.env.local 에 NEXT_PUBLIC_TOSS_CLIENT_KEY 를 추가해주세요.',
    );
  }

  const { loadTossPayments } = await import('@tosspayments/payment-sdk');
  const toss = await loadTossPayments(clientKey);

  await toss.requestPayment('카드', {
    amount: opts.amount,
    orderId: opts.orderId,
    orderName: opts.orderName,
    customerName: '',
    successUrl: opts.successUrl,
    failUrl: opts.failUrl,
  });
}
