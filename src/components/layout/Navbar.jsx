import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Cloud, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Events', path: '/events' },
  { name: 'Resources', path: '/resources' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <Cloud className="w-8 h-8 text-aws-orange" />
            <span className="font-bold text-xl text-aws-dark tracking-tight">
              AWS <span className="text-skit-blue">SBG</span> SKIT
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-aws-orange ${
                    isActive ? 'text-aws-orange' : 'text-aws-dark'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <a 
              href="https://www.meetup.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-aws-orange text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
            >
              Join Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-aws-dark hover:text-aws-orange transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-aws-light text-aws-orange'
                        : 'text-aws-dark hover:bg-gray-50 hover:text-aws-orange'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <a
                href="https://www.meetup.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center mt-4 bg-aws-orange text-white px-5 py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors"
              >
                Join Us on Meetup
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
