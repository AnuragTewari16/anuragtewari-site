import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

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
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.05)]" 
      data-testid="navbar"
    >
      <div className="max-w-[1140px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-manrope font-bold text-xl text-gray-900 hover:text-brand-primary transition-colors duration-200"
            data-testid="nav-logo"
          >
            Anurag Tewari
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`
                  relative font-inter text-[14px] tracking-[0.01em] py-2 px-5
                  min-h-[40px] flex items-center
                  transition-all duration-200 ease-out
                  ${index === navLinks.length - 1 ? 'pr-0' : ''}
                  ${isActive(link.path)
                    ? 'text-brand-primary font-semibold'
                    : 'text-gray-500 font-medium hover:text-gray-900'
                  }
                  group
                `}
                data-testid={`nav-${link.name.toLowerCase().replace(' ', '-')}`}
              >
                {link.name}
                {/* Active indicator / Hover underline */}
                <span 
                  className={`
                    absolute bottom-1 left-5 right-5 h-[2px] rounded-full
                    transition-all duration-200 ease-out
                    ${index === navLinks.length - 1 ? 'right-0' : ''}
                    ${isActive(link.path) 
                      ? 'bg-brand-primary scale-x-100' 
                      : 'bg-gray-300 scale-x-0 group-hover:scale-x-100'
                    }
                  `}
                />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 -mr-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            data-testid="mobile-menu-button"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div 
            className="md:hidden pb-6 pt-2 border-t border-gray-100 animate-slide-down" 
            data-testid="mobile-menu"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`
                    font-inter text-[15px] tracking-[0.01em] py-3 px-3 -mx-3 rounded-lg
                    min-h-[44px] flex items-center
                    transition-all duration-200
                    ${isActive(link.path)
                      ? 'text-brand-primary font-semibold bg-blue-50'
                      : 'text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
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
