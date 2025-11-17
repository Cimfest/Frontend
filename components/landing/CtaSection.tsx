
import React from 'react';
import Button from '../ui/Button';

const CtaSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-brand-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-primary text-brand-dark text-center py-20 px-8 rounded-lg shadow-2xl">
          <h2 className="text-5xl md:text-5xl font-bold">Ready to Create Your Next Hit?</h2>
          <p className="mt-6 max-w-3xl mx-auto text-xl font-light leading-relaxed">
            Join thousands of artists who are already creating professional music with AI. Start your journey today.
          </p>
          <div className="mt-10">
            <Button variant="secondary" className="px-10 py-4 text-lg font-bold">Start Creating Now</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
