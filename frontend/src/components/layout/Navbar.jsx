import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'AI Insights', path: '/ai-insights' },
    { name: 'Investing Insights', path: '/investing-insights' },
    { name: 'Newsletter', path: '/#newsletter' },
    { name: 'Contact', path: '/#contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/#')) return false;
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path) => {
    setIsOpen(false);
    if (path.startsWith('/#')) {
      const elementId = path.replace('/#', '');
      if (location.pathname === '/') {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-default/95 backdrop-blur-sm border-b border-gray-200" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-manrope font-bold text-xl text-gray-900 hover:text-brand-primary transition-colors"
            data-testid="nav-logo"
          >
            Anurag Tewari
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`font-inter text-sm transition-colors ${
                  isActive(link.path)
                    ? 'text-brand-primary font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                data-testid={`nav-${link.name.toLowerCase().replace(' ', '-')}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-button"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down" data-testid="mobile-menu">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`font-inter py-2 transition-colors ${
                    isActive(link.path)
                      ? 'text-brand-primary font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  data-testid={`mobile-nav-${link.name.toLowerCase().replace(' ', '-')}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
