// app/page.tsx

import { HeroSection } from "@/components/landing/HeroSection";
import { MetricsSection } from "@/components/landing/MetricsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CtaSection } from "@/components/landing/CtaSection";

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <MetricsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
