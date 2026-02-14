import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, TrendingUp, Shield, BarChart3, Wallet, AlertTriangle } from 'lucide-react';

export const InvestingPreviewSection = () => {
  const focusAreas = [
    {
      icon: BarChart3,
      text: 'Technical analysis and lightweight swing trading in stocks and crypto'
    },
    {
      icon: TrendingUp,
      text: 'Long-term investing and portfolio construction for working professionals'
    },
    {
      icon: Shield,
      text: 'Risk management, drawdowns, and position sizing'
    },
    {
      icon: Wallet,
      text: 'Side income and passive income ideas that complement a full-time job'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-surface-subtle" data-testid="investing-preview-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <span className="inline-block bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
            Investing & Passive Income
          </span>
          
          <h2 className="font-manrope text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6">
            Build Paths Toward Financial Freedom
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            I'm not your financial advisor. I'm a retail investor who studies technical analysis, risk, 
            and passive income ideas — and I share what I'm learning.
          </p>

          {/* Focus Areas */}
          <div className="mb-8">
            <h3 className="font-manrope text-lg font-semibold text-gray-900 mb-4">
              What I focus on:
            </h3>
            <ul className="space-y-4">
              {focusAreas.map((area, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                    <area.icon className="w-4 h-4 text-teal-700" />
                  </div>
                  <span className="text-gray-600">{area.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8" data-testid="investing-disclaimer">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>Important:</strong> Nothing on this site or in my content is financial advice. 
                Always do your own research and, if needed, consult a licensed professional.
              </p>
            </div>
          </div>

          {/* CTA */}
          <Button
            asChild
            className="bg-brand-secondary hover:bg-teal-700 text-white font-medium px-6 py-3 h-auto rounded-full transition-all shadow-sm hover:-translate-y-0.5"
            data-testid="view-investing-insights-btn"
          >
            <Link to="/investing-insights">
              View Investing Insights
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InvestingPreviewSection;
