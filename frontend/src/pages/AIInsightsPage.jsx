import React from 'react';
import { InsightCard } from '../components/InsightCard';
import { Brain } from 'lucide-react';
import { aiInsights } from '../data/insights';

export const AIInsightsPage = () => {
  return (
    <main className="pt-24 pb-16 md:pt-32 md:pb-24 bg-surface-default min-h-screen" data-testid="ai-insights-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-700" />
            </div>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
              AI Transformation
            </span>
          </div>
          
          <h1 className="font-manrope text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            AI Transformation Insights
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            This is where I write down frameworks, checklists, and breakdowns about using AI in real life 
            and in small businesses. Especially for working professionals who want to think better and work smarter.
          </p>
        </div>

        {/* Content */}
        {aiInsights.length === 0 ? (
          <div className="text-center py-20" data-testid="ai-insights-empty">
            <p className="text-gray-500">No insights yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="ai-insights-grid">
            {aiInsights.map((insight, index) => (
              <InsightCard 
                key={insight.id} 
                insight={insight} 
                variant={index === 0 ? 'featured' : 'default'}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AIInsightsPage;
