import React from 'react';
import { NavLink } from 'react-router-dom';
import { Cloud } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-aws-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="w-8 h-8 text-aws-orange" />
              <span className="font-bold text-2xl tracking-tight">
                AWS <span className="text-skit-blue">SBG</span> SKIT
              </span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Empowering students to build on AWS, fostering a community of cloud enthusiasts, and preparing the next generation of tech leaders.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <NavLink to="/about" className="text-gray-400 hover:text-aws-orange transition-colors">About Us</NavLink>
              </li>
              <li>
                <NavLink to="/events" className="text-gray-400 hover:text-aws-orange transition-colors">Events</NavLink>
              </li>
              <li>
                <NavLink to="/resources" className="text-gray-400 hover:text-aws-orange transition-colors">Resources</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="text-gray-400 hover:text-aws-orange transition-colors">Contact</NavLink>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Connect With Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:bg-aws-orange hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-lg"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:bg-[#0A66C2] hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-lg"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:bg-[#E1306C] hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-lg"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AWS Student Builder Group SKIT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
