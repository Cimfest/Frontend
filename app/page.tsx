import HeroSection from '@/components/landing/HeroSection'
import MetricsSection from '@/components/landing/MetricsSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import CtaSection from '@/components/landing/CtaSection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <MetricsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  )
}