import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail } from 'lucide-react';

export const NewsletterSection = () => {
  return (
    <section
      id="newsletter"
      className="py-16 md:py-24 bg-white"
      data-testid="newsletter-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-primary/10 rounded-full mb-6">
            <Mail className="w-6 h-6 text-brand-primary" />
          </div>

          <h2 className="font-manrope text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Join Our Growing Community
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            Get deep-dive emails on AI transformation and investing, plus early access to tools,
            templates, and experiments I'm building.
          </p>

          <form
            action="https://app.kit.com/forms/9092194/subscriptions"
            method="post"
            target="_blank"
            className="space-y-4"
            data-testid="newsletter-form"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                name="first_name"
                placeholder="Your name"
                className="h-12 px-4 bg-white border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-blue-100 rounded-lg"
                data-testid="newsletter-name-input"
              />

              <Input
                type="email"
                name="email_address"
                placeholder="Your email"
                required
                className="h-12 px-4 bg-white border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-blue-100 rounded-lg"
                data-testid="newsletter-email-input"
              />

              <Button
                type="submit"
                className="bg-brand-primary hover:bg-brand-primary-hover text-white font-medium px-6 h-12 rounded-lg transition-all whitespace-nowrap"
                data-testid="newsletter-submit-btn"
              >
                Join the newsletter
              </Button>
            </div>
          </form>

          <p className="text-sm text-gray-400 mt-4">
            No spam. Just experiments, lessons, and occasional updates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
