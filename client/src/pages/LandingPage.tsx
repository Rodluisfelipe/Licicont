import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import LogosSection from '@/components/sections/LogosSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProcessSection from '@/components/sections/ProcessSection';
import TickerSection from '@/components/sections/TickerSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FAQSection from '@/components/sections/FAQSection';
import CTASection from '@/components/sections/CTASection';
import CredentialForm from '@/components/sections/CredentialForm';
import FloatingCTA from '@/components/sections/FloatingCTA';

export default function LandingPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openForm = () => setIsFormOpen(true);

  return (
    <>
      <Navbar onContact={openForm} />
      <main>
        <HeroSection onContact={openForm} />
        <LogosSection />
        <AboutSection onContact={openForm} />
        <ServicesSection />
        <ProcessSection />
        <TickerSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection onContact={openForm} />
      </main>
      <Footer />
      <CredentialForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <FloatingCTA onContact={openForm} />
    </>
  );
}
