import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import LogosSection from '@/components/sections/LogosSection';
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
      <Navbar onRequestAccess={openForm} />
      <main>
        <HeroSection onRequestAccess={openForm} />
        <LogosSection />
        <ServicesSection />
        <ProcessSection />
        <TickerSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection onRequestAccess={openForm} />
      </main>
      <Footer />
      <CredentialForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <FloatingCTA onRequestAccess={openForm} />
    </>
  );
}
