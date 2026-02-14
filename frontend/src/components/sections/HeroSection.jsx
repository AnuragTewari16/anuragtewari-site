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
          <div className="order-2 lg:order-1">
            <h1 className="font-manrope text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
              Practical AI transformation and smarter investing for working professionals.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed">
              I help working professionals and small businesses use AI to think better, work smarter, and build paths toward financial freedom.
            </p>
            
            <p className="text-base text-gray-500 mb-8">
              Based in Berlin, originally from India. Exploring AI transformation, technical investing, and long term financial freedom.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button
                asChild
                className="bg-brand-primary hover:bg-brand-primary-hover text-white font-medium px-8 py-3 h-auto rounded-full transition-all shadow-sm hover:-translate-y-0.5"
                data-testid="cta-watch-videos"
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
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

          {/* Profile Image Placeholder */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1767175473698-859bc73e8e64?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHw0fHxtaW5pbWFsaXN0JTIwcHJvZmVzc2lvbmFsJTIwbWluaW1hbGlzdCUyMHBvcnRyYWl0JTIwbWFufGVufDB8fHx8MTc3MTA2NTE0MHww&ixlib=rb-4.1.0&q=85"
                  alt="Anurag Tewari"
                  className="w-full h-full object-cover"
                  data-testid="hero-profile-image"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-primary/10 rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
