import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'BabyPet — 잃어버린 시간의 복원',
  description:
    '반려동물의 아기 시절을 AI로 상상 복원합니다. 처음 만났을 그 날, 그 작고 따뜻했던 모습을 다시 만나보세요.',
  keywords: '반려동물, 강아지, 고양이, AI 이미지, 아기 시절, 유기견, 입양',
  openGraph: {
    title: 'BabyPet — 잃어버린 시간의 복원',
    description: '반려동물의 아기 시절을 AI로 상상 복원합니다.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
