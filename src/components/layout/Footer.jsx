import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Linkedin, Instagram } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      name: 'YouTube', 
      icon: Youtube, 
      href: 'https://youtube.com/@anurag_tewari',
      label: 'YouTube Channel'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      href: 'https://www.linkedin.com/in/anuragtiwari16',
      label: 'LinkedIn Profile'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      href: 'https://www.instagram.com/anuragtewari16/',
      label: 'Instagram Profile'
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200" data-testid="footer">
      <div className="max-w-[1140px] mx-auto px-6 lg:px-8 py-12">
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
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-brand-primary transition-colors p-2 rounded-lg hover:bg-gray-50"
                aria-label={social.label}
                data-testid={`footer-${social.name.toLowerCase()}`}
              >
                <social.icon className="h-5 w-5" />
                <span className="text-sm font-medium hidden sm:inline">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Legal links */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <div className="flex justify-center items-center space-x-6 text-xs">
            <Link 
              to="/impressum" 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="footer-impressum-link"
            >
              Impressum
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              to="/privacy-policy" 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="footer-privacy-link"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
