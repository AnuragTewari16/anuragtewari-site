import React, { useState, useEffect } from 'react';
import { InsightCard } from '../components/InsightCard';
import { TrendingUp, Loader2, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const InvestingInsightsPage = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        // First try to seed insights if empty
        await axios.post(`${API}/seed-insights`).catch(() => {});
        
        const response = await axios.get(`${API}/insights?category=investing`);
        setInsights(response.data);
      } catch (err) {
        setError('Failed to load insights. Please try again later.');
        console.error('Error fetching investing insights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <main className="pt-24 pb-16 md:pt-32 md:pb-24 bg-surface-default min-h-screen" data-testid="investing-insights-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-teal-700" />
            </div>
            <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
              Investing & Passive Income
            </span>
          </div>
          
          <h1 className="font-manrope text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Investing & Passive Income Insights
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            I'm not a financial advisor — just a retail investor sharing my own research and frameworks. 
            Here you'll find my thoughts on technical analysis, lightweight swing trading, risk management, 
            and passive income ideas for working professionals.
          </p>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5" data-testid="investing-page-disclaimer">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>Important Disclaimer:</strong> Nothing on this page or in my content is financial advice. 
                Always do your own research and, if needed, consult a licensed professional before making 
                investment decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20" data-testid="investing-insights-loading">
            <Loader2 className="w-8 h-8 text-brand-secondary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20" data-testid="investing-insights-error">
            <p className="text-red-600">{error}</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-20" data-testid="investing-insights-empty">
            <p className="text-gray-500">No insights yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8" data-testid="investing-insights-grid">
            {insights.map((insight, index) => (
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

export default InvestingInsightsPage;
