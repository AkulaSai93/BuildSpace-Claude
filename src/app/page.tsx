import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/marketing/Hero";
import { LogoStrip } from "@/components/marketing/LogoStrip";
import { StatsBar } from "@/components/marketing/StatsBar";
import { ProjectsCarousel } from "@/components/marketing/ProjectsCarousel";
import { StepsSection } from "@/components/marketing/StepsSection";
import { AIFeatures } from "@/components/marketing/AIFeatures";
import { LearningExperience } from "@/components/marketing/LearningExperience";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CTABand } from "@/components/marketing/CTABand";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f7]">
      <Header />
      <main className="flex-1">
        <Hero />
        <LogoStrip />
        <StatsBar />
        <ProjectsCarousel />
        <StepsSection />
        <AIFeatures />
        <LearningExperience />
        <Testimonials />
        <CTABand />
      </main>
      <Footer />
    </div>
  );
}
