// Type declaration for @tosspayments/payment-sdk
// Install the package when going to production: npm install @tosspayments/payment-sdk

declare module '@tosspayments/payment-sdk' {
  export interface TossPaymentParams {
    amount: number;
    orderId: string;
    orderName: string;
    customerName: string;
    successUrl: string;
    failUrl: string;
  }

  export interface TossPaymentsInstance {
    requestPayment(method: string, params: TossPaymentParams): Promise<void>;
  }

  export function loadTossPayments(clientKey: string): Promise<TossPaymentsInstance>;
}
