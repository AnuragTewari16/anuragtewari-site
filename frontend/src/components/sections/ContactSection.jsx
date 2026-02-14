import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setResponseMessage('Please fill in all fields.');
      return;
    }

    setStatus('loading');
    
    try {
      const response = await axios.post(`${API}/contact`, formData);
      setStatus('success');
      setResponseMessage(response.data.message);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      setResponseMessage(error.response?.data?.detail || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-surface-subtle" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-manrope text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Say Hello
          </h2>
          
          <p className="text-lg text-gray-600 mb-6">
            I'd love to hear from you — whether it's about collaboration, podcast or interview ideas, 
            or just to connect with people experimenting with AI and investing.
          </p>

          {/* Email display */}
          <div className="flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5 text-brand-primary" />
            <a 
              href="mailto:tewariventures@outlook.com" 
              className="text-brand-primary hover:text-brand-primary-hover font-medium transition-colors"
              data-testid="contact-email-link"
            >
              tewariventures@outlook.com
            </a>
          </div>

          <p className="text-sm text-gray-500 mb-8 italic">
            I'm not taking on paid clients or consulting work right now — everything here is for 
            education and experimentation.
          </p>

          {/* Contact Form */}
          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center gap-3" data-testid="contact-success">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <span className="text-green-800 font-medium">{responseMessage}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-12 px-4 bg-white border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-blue-100 rounded-lg"
                  data-testid="contact-name-input"
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 px-4 bg-white border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-blue-100 rounded-lg"
                  data-testid="contact-email-input"
                />
              </div>
              
              <Textarea
                name="message"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="px-4 py-3 bg-white border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-blue-100 rounded-lg resize-none"
                data-testid="contact-message-input"
              />
              
              {status === 'error' && (
                <p className="text-red-600 text-sm" data-testid="contact-error">{responseMessage}</p>
              )}
              
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="bg-brand-primary hover:bg-brand-primary-hover text-white font-medium px-6 py-3 h-auto rounded-full transition-all shadow-sm hover:-translate-y-0.5"
                data-testid="contact-submit-btn"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
