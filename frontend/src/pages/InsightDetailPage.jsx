import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertTriangle, Youtube, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const InsightDetailPage = () => {
  const { id, category } = useParams();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isInvesting = category === 'investing-insights';
  const backLink = isInvesting ? '/investing-insights' : '/ai-insights';
  const backText = isInvesting ? 'Investing Insights' : 'AI Insights';

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const response = await axios.get(`${API}/insights/${id}`);
        setInsight(response.data);
      } catch (err) {
        setError('Insight not found.');
        console.error('Error fetching insight:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [id]);

  // Convert markdown-like content to HTML
  const renderContent = (content) => {
    if (!content) return null;
    
    const lines = content.split('\n');
    const elements = [];
    let currentList = [];
    let listType = null;

    const flushList = () => {
      if (currentList.length > 0) {
        if (listType === 'ul') {
          elements.push(
            <ul key={`list-${elements.length}`} className="mb-4 pl-6 space-y-2">
              {currentList.map((item, i) => (
                <li key={i} className="list-disc text-gray-700">{item}</li>
              ))}
            </ul>
          );
        } else {
          elements.push(
            <ol key={`list-${elements.length}`} className="mb-4 pl-6 space-y-2">
              {currentList.map((item, i) => (
                <li key={i} className="list-decimal text-gray-700">{item}</li>
              ))}
            </ol>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="font-manrope text-2xl font-bold text-gray-900 mt-8 mb-4">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="font-manrope text-xl font-semibold text-gray-900 mt-6 mb-3">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('- ')) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(trimmedLine.replace('- ', ''));
      } else if (/^\d+\.\s/.test(trimmedLine)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(trimmedLine.replace(/^\d+\.\s/, ''));
      } else if (trimmedLine === '') {
        flushList();
      } else {
        flushList();
        // Handle bold text
        const formattedLine = trimmedLine.replace(
          /\*\*(.*?)\*\*/g, 
          '<strong class="font-semibold text-gray-900">$1</strong>'
        ).replace(
          /\*(.*?)\*/g,
          '<em>$1</em>'
        );
        elements.push(
          <p key={index} className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: formattedLine }} />
        );
      }
    });

    flushList();
    return elements;
  };

  if (loading) {
    return (
      <main className="pt-24 pb-16 md:pt-32 md:pb-24 bg-surface-default min-h-screen" data-testid="insight-detail-loading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !insight) {
    return (
      <main className="pt-24 pb-16 md:pt-32 md:pb-24 bg-surface-default min-h-screen" data-testid="insight-detail-error">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error || 'Insight not found.'}</p>
            <Button asChild variant="outline">
              <Link to={backLink}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {backText}
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const badgeClass = insight.category === 'ai' 
    ? 'bg-blue-50 text-blue-700' 
    : 'bg-teal-50 text-teal-700';

  return (
    <main className="pt-24 pb-16 md:pt-32 md:pb-24 bg-surface-default min-h-screen" data-testid="insight-detail-page">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link 
          to={backLink}
          className="inline-flex items-center text-gray-600 hover:text-brand-primary transition-colors mb-8"
          data-testid="insight-back-link"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {backText}
        </Link>

        {/* Investing Disclaimer */}
        {insight.category === 'investing' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8" data-testid="insight-disclaimer">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>Disclaimer:</strong> This insight is for education and entertainment only. 
                It is not investment advice. Do your own research and consider speaking to a licensed professional.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {insight.tags.map((tag, index) => (
              <span 
                key={index}
                className={`${badgeClass} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide`}
              >
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="font-manrope text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            {insight.title}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed mb-4">
            {insight.summary}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(insight.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            {insight.youtube_url && (
              <a 
                href={insight.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
                data-testid="insight-youtube-link"
              >
                <Youtube className="w-4 h-4 mr-1" />
                Watch Video
              </a>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="prose-custom" data-testid="insight-content">
          {renderContent(insight.content)}
        </div>

        {/* YouTube Embed (if available) */}
        {insight.youtube_url && (
          <div className="mt-12 aspect-video rounded-xl overflow-hidden bg-gray-100" data-testid="insight-youtube-embed">
            <iframe
              src={insight.youtube_url.replace('watch?v=', 'embed/')}
              title={insight.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}

        {/* Back to list */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Button asChild variant="outline" className="rounded-full">
            <Link to={backLink}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {backText}
            </Link>
          </Button>
        </div>
      </article>
    </main>
  );
};

export default InsightDetailPage;
