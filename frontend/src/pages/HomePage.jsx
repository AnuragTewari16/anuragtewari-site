import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { DecisionQualitySection } from '../components/sections/DecisionQualitySection';
import { AIPreviewSection } from '../components/sections/AIPreviewSection';
import { InvestingPreviewSection } from '../components/sections/InvestingPreviewSection';
import { NewsletterSection } from '../components/sections/NewsletterSection';
import { ContactSection } from '../components/sections/ContactSection';

export const HomePage = () => {
  return (
    <main data-testid="home-page">
      <HeroSection />
      <AboutSection />
      <DecisionQualitySection />
      <AIPreviewSection />
      <InvestingPreviewSection />
      <NewsletterSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;
