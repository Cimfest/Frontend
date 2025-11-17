"use client";

import React, { useState, useCallback, useEffect } from 'react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatarInitial: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "I went from humming melodies to having a complete album in just two weeks. This platform is revolutionary.",
    name: "Aminata Dialo",
    role: "Singer/Songwriter",
    avatarInitial: "AD",
  },
  {
    quote: "The AI instrumental generation is mind-blowing. It perfectly captured the vibe I was going for without me having to explain it.",
    name: "Carlos Reyes",
    role: "Indie Producer",
    avatarInitial: "CR",
  },
  {
    quote: "As someone who can't play an instrument, VocalStudio has unlocked a new level of creativity for me. It's magic.",
    name: "Jenna Smith",
    role: "Vocalist",
    avatarInitial: "JS",
  },
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, []);

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextTestimonial]);

  const { quote, name, role, avatarInitial } = testimonials[currentIndex];

  return (
    <section className="py-24 md:py-32 bg-brand-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">What Artists Say</h2>
          <p className="mt-6 text-xl text-gray-300">Join thousands of creators who've transformed their music.</p>
        </div>
        <div className="mt-16 max-w-4xl mx-auto bg-brand-dark-secondary p-10 rounded-lg shadow-2xl border-l-4 border-brand-blue relative">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center font-bold text-brand-dark text-2xl shadow-lg">
              {avatarInitial}
            </div>
            <div className="flex-1">
              <p className="text-xl italic text-gray-100 leading-relaxed font-light">"{quote}"</p>
              <footer className="mt-6">
                <p className="font-bold text-white text-lg">{name}</p>
                <p className="text-brand-primary font-semibold">{role}</p>
              </footer>
            </div>
          </div>
           <div className="mt-8 flex items-center justify-between">
             <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-brand-primary fill-brand-primary" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ))}
             </div>
             <div className="flex space-x-3">
                <button onClick={prevTestimonial} className="w-12 h-12 rounded-full bg-brand-light-gray hover:bg-brand-primary transition-colors flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button onClick={nextTestimonial} className="w-12 h-12 rounded-full bg-brand-light-gray hover:bg-brand-primary transition-colors flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
                </button>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
