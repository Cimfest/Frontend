"use client";

import React, { useState } from 'react';
import Button from '../ui/Button';

const MusicNoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["Notes", "Features", "Pricing", "About", "Contact"];

  return (
    <header className="bg-brand-dark/95 backdrop-blur-md sticky top-0 z-50 border-b-2 border-brand-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
             <MusicNoteIcon className="h-8 w-8 text-brand-primary" />
             <span className="text-3xl font-bold text-white">Hamonix</span>
          </div>
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a key={link} href="#" className="text-gray-300 hover:text-brand-primary font-semibold transition-colors text-lg">
                {link}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors font-semibold">Sign In</a>
            <Button variant="primary">Get Started</Button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-primary hover:text-yellow-400 focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-brand-dark-secondary border-t border-brand-primary">
          {navLinks.map((link) => (
            <a key={link} href="#" className="block text-gray-300 hover:text-brand-primary px-3 py-2 rounded-md font-semibold">
              {link}
            </a>
          ))}
          <div className="border-t border-brand-light-gray pt-4 space-y-3">
             <a href="#" className="block w-full text-left text-gray-300 hover:text-white px-3 py-2">Sign In</a>
             <Button variant="primary" className="w-full">Get Started</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export { Navbar };
export default Navbar;
