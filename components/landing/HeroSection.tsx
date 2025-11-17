
import React from 'react';
import Button from '../ui/Button';

const HeroSection: React.FC = () => {
  return (
    <section className="py-24 md:py-40 bg-brand-dark text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
          Turn Your Voice Into<br />
          <span className="text-brand-primary">Studio Magic</span>
        </h1>
        <p className="mt-8 max-w-3xl mx-auto text-lg md:text-xl text-gray-300 font-light">
          Upload your raw vocals and watch our AI transform them into professional, radio-ready tracks. From bedroom recordings to Billboard potential in minutes.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button variant="primary" className="px-8 py-4 text-lg">Start Creating Free</Button>
          <Button variant="outline" className="px-8 py-4 text-lg">Watch Demo</Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
