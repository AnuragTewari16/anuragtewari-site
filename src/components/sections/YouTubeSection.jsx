import React from 'react';
import { Youtube, Play } from 'lucide-react';
import { Button } from '../ui/button';

export const YouTubeSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white" data-testid="youtube-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-6">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
              
              {/* Heading */}
              <h2 className="font-manrope text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                Watch on YouTube
              </h2>
              
              {/* Description */}
              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
                I break down AI tools, stock market insights, trading strategies, and systems for building 
                smarter income streams — explained clearly, without unnecessary complexity.
              </p>
              
              {/* CTA Button */}
              <Button
                asChild
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-3 h-auto rounded-full transition-all shadow-lg hover:-translate-y-0.5"
                data-testid="youtube-subscribe-btn"
              >
                <a 
                  href="https://youtube.com/@anurag_tewari" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Youtube className="mr-2 h-5 w-5" />
                  Subscribe on YouTube
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;
