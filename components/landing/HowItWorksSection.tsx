
import React from 'react';

const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>
);

const MusicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
);

const CodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);

const Step: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-brand-primary text-brand-dark mb-6 shadow-lg">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white">{title}</h3>
    <p className="mt-3 text-gray-300 text-lg leading-relaxed">{description}</p>
  </div>
);

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-brand-dark border-t-4 border-b-4 border-brand-blue">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white">How It Works</h2>
          <p className="mt-6 text-xl text-gray-300">Three simple steps to transform your voice into professional music.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-16 md:gap-12">
          <Step 
            icon={<MicrophoneIcon className="w-10 h-10"/>}
            title="Upload Your Voice"
            description="Record a raw vocal track. No instruments needed."
          />
          <Step 
            icon={<MusicIcon className="w-10 h-10"/>}
            title="AI-Powered Production"
            description="Our AI builds a full instrumental track in your chosen genre around your performance."
          />
          <Step 
            icon={<CodeIcon className="w-10 h-10"/>}
            title="Export to the World"
            description="Download your inspired song, AI-generated artwork, and press kit, ready for Spotify and Apple Music."
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
