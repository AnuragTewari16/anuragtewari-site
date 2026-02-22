import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, Lightbulb, TrendingUp, Brain, BarChart3 } from 'lucide-react';

export const InsightsPreviewSection = () => {
  const topics = [
    {
      icon: Brain,
      title: 'AI Tools & Workflows',
      description: 'Practical frameworks for using AI to think better, research faster, and work smarter.'
    },
    {
      icon: TrendingUp,
      title: 'Investing Fundamentals',
      description: 'Position sizing, risk management, and long-term portfolio strategies for working professionals.'
    },
    {
      icon: BarChart3,
      title: 'Market Analysis',
      description: 'Technical analysis basics, support/resistance, and reading market psychology.'
    },
    {
      icon: Lightbulb,
      title: 'Building Leverage',
      description: 'Ideas for building income streams and financial freedom beyond your 9–5.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-surface-subtle" data-testid="insights-preview-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="inline-block bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
            What I Write About
          </span>
          
          <h2 className="font-manrope text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6">
            Insights for Ambitious Professionals
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            I share what I'm learning about AI, investing, and building leverage — written for people 
            who want practical frameworks, not hype.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {topics.map((topic, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                  <topic.icon className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-manrope font-semibold text-gray-900 mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          asChild
          className="bg-brand-primary hover:bg-brand-primary-hover text-white font-medium px-6 py-3 h-auto rounded-full transition-all shadow-sm hover:-translate-y-0.5"
          data-testid="view-all-insights-btn"
        >
          <Link to="/insights">
            View All Insights
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default InsightsPreviewSection;
