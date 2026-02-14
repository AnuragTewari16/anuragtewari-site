import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

// Static newsletter form - ready for future integration
// To connect to ConvertKit, Mailchimp, etc:
// 1. Add your form action URL
// 2. Update the handleSubmit function

export const NewsletterSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      setStatus('error');
      setMessage('Please fill in all fields.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Replace with actual newsletter service integration
    // Example for ConvertKit:
    // const response = await fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ api_key: 'YOUR_API_KEY', email, first_name: name })
    // });
    
    setStatus('success');
    setMessage('Thanks for subscribing! (Demo mode - connect your newsletter service)');
    setName('');
    setEmail('');
  };

  return (
    <section id="newsletter" className="py-16 md:py-24 bg-white" data-testid="newsletter-section">
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

          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 inline-flex items-center gap-3" data-testid="newsletter-success">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-green-800 font-medium">{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="newsletter-form">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 px-4 bg-white border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-blue-100 rounded-lg"
                  data-testid="newsletter-name-input"
                />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 px-4 bg-white border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-blue-100 rounded-lg"
                  data-testid="newsletter-email-input"
                />
                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-brand-primary hover:bg-brand-primary-hover text-white font-medium px-6 h-12 rounded-lg transition-all whitespace-nowrap"
                  data-testid="newsletter-submit-btn"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Join the newsletter'
                  )}
                </Button>
              </div>
              
              {status === 'error' && (
                <p className="text-red-600 text-sm" data-testid="newsletter-error">{message}</p>
              )}
            </form>
          )}

          <p className="text-sm text-gray-400 mt-4">
            No spam. Just experiments, lessons, and occasional updates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
