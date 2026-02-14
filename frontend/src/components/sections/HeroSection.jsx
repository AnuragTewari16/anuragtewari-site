import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Mail } from 'lucide-react';

export const HeroSection = () => {
  const scrollToNewsletter = () => {
    const element = document.getElementById('newsletter');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-surface-default" data-testid="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 max-w-xl">
            <h1 className="font-manrope text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
              Practical AI transformation and smarter investing.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              I explore how AI and disciplined investing can help you think better, work smarter, and build long-term financial freedom.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button
                asChild
                className="bg-brand-primary hover:bg-brand-primary-hover text-white font-medium px-8 py-3 h-auto rounded-full transition-all shadow-sm hover:-translate-y-0.5"
                data-testid="cta-watch-videos"
              >
                <a href="https://youtube.com/@anuragautomates?si=n1NMh3xTf0wO2RoG" target="_blank" rel="noopener noreferrer">
                  Watch my videos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              
              <Button
                variant="outline"
                onClick={scrollToNewsletter}
                className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 font-medium px-8 py-3 h-auto rounded-full transition-all"
                data-testid="cta-join-newsletter"
              >
                <Mail className="mr-2 h-4 w-4" />
                Join the newsletter
              </Button>
            </div>

            <p className="text-sm text-gray-400">
              This is my personal site. All opinions are my own.
            </p>
          </div>

          {/* Profile Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                <img
                  src="https://customer-assets.emergentagent.com/job_smart-work-money/artifacts/os7vroun_47852617_Male_LongCoat_104_Design_0_results-4.jpg"
                  alt="Anurag Tewari"
                  className="w-full h-full object-cover"
                  data-testid="hero-profile-image"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-brand-primary/10 rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
