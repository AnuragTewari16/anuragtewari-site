import React from 'react';
import { Target } from 'lucide-react';

export const DecisionQualitySection = () => {
  return (
    <section className="py-12 md:py-16 bg-surface-default" data-testid="decision-quality-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-primary/10 rounded-full mb-6">
            <Target className="w-6 h-6 text-brand-primary" />
          </div>
          <p className="font-manrope text-xl md:text-2xl text-gray-800 leading-relaxed font-medium">
            "At the core, I'm interested in one thing: 
            <span className="text-brand-primary"> improving decision quality</span> — 
            in work, in money, and in life."
          </p>
        </div>
      </div>
    </section>
  );
};

export default DecisionQualitySection;
