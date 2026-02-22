import React, { useState } from 'react';
import { InsightCard } from '../components/InsightCard';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import { insights } from '../data/insights';

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI & Tools' },
  { id: 'markets', label: 'Markets & Investing' },
];

export const InsightsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredInsights = activeFilter === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === activeFilter);

  return (
    <main className="pt-24 pb-16 md:pt-32 md:pb-24 bg-surface-default min-h-screen" data-testid="insights-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-brand-primary" />
            </div>
          </div>
          
          <h1 className="font-manrope text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Insights
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Practical frameworks and breakdowns on AI tools, investing strategies, and financial markets — 
            written for ambitious professionals building leverage beyond their 9–5.
          </p>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4" data-testid="insights-disclaimer">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>Disclaimer:</strong> Content related to investing and markets is for education only, not financial advice. 
                Always do your own research.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2" data-testid="filter-tabs">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`
                  px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                  ${activeFilter === tab.id
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900'
                  }
                `}
                data-testid={`filter-${tab.id}`}
              >
                {tab.label}
                <span className={`ml-2 text-xs ${activeFilter === tab.id ? 'text-white/70' : 'text-gray-400'}`}>
                  ({tab.id === 'all' 
                    ? insights.length 
                    : insights.filter(i => i.category === tab.id).length
                  })
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {filteredInsights.length === 0 ? (
          <div className="text-center py-20" data-testid="insights-empty">
            <p className="text-gray-500">No insights in this category yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="insights-grid">
            {filteredInsights.map((insight, index) => (
              <InsightCard 
                key={insight.id} 
                insight={insight} 
                variant={index === 0 && activeFilter === 'all' ? 'featured' : 'default'}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default InsightsPage;
