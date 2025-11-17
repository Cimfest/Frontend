import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#F59E0B',
        'brand-primary-hover': '#EAAE0B',
        'brand-dark': '#111827',
        'brand-dark-secondary': '#1F2937',
        'brand-light-gray': '#374151',
        'brand-blue': '#3B82F6',
        'brand-gray': '#2D3748',
        'brand-text': '#F3F4F6',
      },
      backgroundColor: {
        'brand-dark': '#111827',
        'brand-dark-secondary': '#1F2937',
        'brand-primary': '#F59E0B',
        'brand-gray': '#2D3748',
      },
      textColor: {
        'brand-primary': '#F59E0B',
        'brand-text': '#F3F4F6',
      },
      borderColor: {
        'brand-light-gray': '#374151',
        'brand-blue': '#3B82F6',
      },
    },
  },
  plugins: [],
};

export default config;
