import Link from 'next/link';
import Header from '@/components/shared/Header';
import Button from '@/components/ui/Button';

export default function ArchivePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="page-container pt-24 text-center">
        <div className="text-6xl mb-6">📚</div>
        <h1 className="section-title mb-3">기억 아카이브</h1>
        <p className="section-subtitle mb-10">
          메모리 북 플랜을 선택하면 소중한 추억이 여기에 영구 보관돼요
        </p>
        <div className="card-beige py-16 mb-8">
          <p className="text-soft-brown">아직 저장된 기억이 없어요</p>
        </div>
        <Link href="/upload">
          <Button size="lg">첫 번째 기억 만들기 →</Button>
        </Link>
      </div>
    </div>
  );
}
