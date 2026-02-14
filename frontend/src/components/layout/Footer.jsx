import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Linkedin, Instagram } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      name: 'Anurag Automates', 
      icon: Youtube, 
      href: '#', // Placeholder
      label: 'Anurag Automates YouTube'
    },
    { 
      name: 'Anurag Invests', 
      icon: Youtube, 
      href: '#', // Placeholder
      label: 'Anurag Invests YouTube'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      href: '#', // Placeholder
      label: 'LinkedIn Profile'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      href: '#', // Placeholder
      label: 'Instagram Profile'
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright and disclaimer */}
          <div className="text-center md:text-left">
            <p className="text-gray-600 text-sm">
              © {currentYear} Anurag Tewari. Personal site. All opinions are my own.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              This site is for education and entertainment only, not financial advice.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-primary transition-colors p-2 rounded-full hover:bg-gray-100"
                aria-label={social.label}
                data-testid={`footer-${social.name.toLowerCase().replace(' ', '-')}`}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Future legal links placeholder */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <div className="flex justify-center space-x-6 text-xs text-gray-400">
            <span>Impressum (Coming Soon)</span>
            <span>•</span>
            <span>Privacy Policy (Coming Soon)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
