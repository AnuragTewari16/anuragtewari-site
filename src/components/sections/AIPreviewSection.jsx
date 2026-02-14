import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowRight, Brain, Lightbulb, FileSearch, Workflow } from 'lucide-react';

export const AIPreviewSection = () => {
  const examples = [
    {
      icon: Brain,
      text: 'Using AI to structure and prioritize your tasks and projects'
    },
    {
      icon: FileSearch,
      text: 'Using AI for research and decision-making frameworks'
    },
    {
      icon: Lightbulb,
      text: 'Using AI with your own notes and data to surface insights'
    },
    {
      icon: Workflow,
      text: 'Designing light, AI-assisted workflows that remove friction from your day'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white" data-testid="ai-preview-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
            AI Transformation
          </span>
          
          <h2 className="font-manrope text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6">
            Transform How You Work with AI
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            I help individuals and small businesses use AI to think better, decide better, and work smarter. 
            My focus is on working professionals who want to change how they operate day to day.
          </p>
          
          <p className="text-base text-gray-600 leading-relaxed mb-8">
            Automation is just a subset of what I cover. The real focus is on 
            <strong className="text-gray-900"> transforming workflows and decisions</strong> with AI — 
            not building complex fully automated systems.
          </p>

          {/* Examples */}
          <div className="mb-8">
            <h3 className="font-manrope text-lg font-semibold text-gray-900 mb-4">
              Examples of what I cover:
            </h3>
            <ul className="space-y-4">
              {examples.map((example, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <example.icon className="w-4 h-4 text-blue-700" />
                  </div>
                  <span className="text-gray-600">{example.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <Button
            asChild
            className="bg-brand-primary hover:bg-brand-primary-hover text-white font-medium px-6 py-3 h-auto rounded-full transition-all shadow-sm hover:-translate-y-0.5"
            data-testid="view-ai-insights-btn"
          >
            <Link to="/ai-insights">
              View AI Insights
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AIPreviewSection;
