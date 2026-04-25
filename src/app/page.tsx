import Header from '@/components/ui/Header';
import HeroSection from '@/components/landing/HeroSection';
import ProblemSection from '@/components/landing/ProblemSection';
import SolutionSection from '@/components/landing/SolutionSection';
import ResultExampleSection from '@/components/landing/ResultExampleSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import AdoptionSection from '@/components/landing/AdoptionSection';
import PricingSection from '@/components/landing/PricingSection';
import DonationSection from '@/components/landing/DonationSection';
import FinalCTASection from '@/components/landing/FinalCTASection';

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <ResultExampleSection />
        <HowItWorksSection />
        <AdoptionSection />
        <PricingSection />
        <DonationSection />
        <FinalCTASection />
      </main>

      <footer className="bg-cream border-t border-beige py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-soft-brown text-sm">
          <p className="font-serif text-deep-brown font-medium">BabyPet</p>
          <p>© 2026 BabyPet. 반려동물의 잃어버린 시간을 복원합니다.</p>
          <p className="text-xs text-soft-brown/60">
            🐾 수익의 2%가 유기동물 보호를 위해
          </p>
        </div>
      </footer>
    </>
  );
}
