
import React from 'react';

const MusicNoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

const Footer: React.FC = () => {
  const footerLinks = {
    'Product': ['Features', 'Pricing', 'Updates', 'Demo'],
    'Company': ['About Us', 'Careers', 'Contact', 'Blog'],
    'Legal': ['Terms of Service', 'Privacy Policy', 'Cookie Policy'],
  };

  return (
    <footer className="bg-brand-dark-secondary border-t-4 border-brand-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <MusicNoteIcon className="h-8 w-8 text-brand-primary" />
              <span className="text-2xl font-bold text-white">Hamonix</span>
            </div>
            <p className="mt-4 text-gray-300 text-base font-light">AI-powered music creation for Cameroonian artists.</p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-white text-lg">{title}</h3>
              <ul className="mt-6 space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-brand-primary font-semibold transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 border-t border-brand-light-gray pt-10 text-center text-base text-gray-400">
          <p>&copy; {new Date().getFullYear()} Hamonix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
export default Footer;
