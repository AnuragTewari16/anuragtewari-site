import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { YouTubeSection } from '../components/sections/YouTubeSection';
import { InsightsPreviewSection } from '../components/sections/InsightsPreviewSection';
import { NewsletterSection } from '../components/sections/NewsletterSection';
import { ContactSection } from '../components/sections/ContactSection';

export const HomePage = () => {
  return (
    <main data-testid="home-page">
      <HeroSection />
      <AboutSection />
      <YouTubeSection />
      <InsightsPreviewSection />
      <NewsletterSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;
