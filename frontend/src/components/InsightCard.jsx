import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Youtube } from 'lucide-react';

export const InsightCard = ({ insight, variant = 'default' }) => {
  const { id, title, summary, tags, category, youtube_url } = insight;
  
  const badgeClass = category === 'ai' 
    ? 'bg-blue-50 text-blue-700' 
    : 'bg-teal-50 text-teal-700';
  
  const linkPath = category === 'ai' 
    ? `/ai-insights/${id}` 
    : `/investing-insights/${id}`;

  return (
    <article 
      className={`bg-white border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-200 hover:shadow-lg group ${
        variant === 'featured' ? 'md:col-span-2' : ''
      }`}
      data-testid={`insight-card-${id}`}
    >
      <div className="p-6 md:p-8 flex flex-col h-full">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className={`${badgeClass} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide`}
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Title */}
        <h3 className="font-manrope text-xl font-semibold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors">
          {title}
        </h3>
        
        {/* Summary */}
        <p className="text-gray-600 leading-relaxed flex-grow mb-4">
          {summary}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Link 
            to={linkPath}
            className="inline-flex items-center text-brand-primary hover:text-brand-primary-hover font-medium text-sm transition-colors"
            data-testid={`read-insight-${id}`}
          >
            Read Insight
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          {youtube_url && (
            <a 
              href={youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-500 hover:text-red-600 text-sm transition-colors"
              data-testid={`youtube-link-${id}`}
            >
              <Youtube className="w-4 h-4 mr-1" />
              Watch
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default InsightCard;
