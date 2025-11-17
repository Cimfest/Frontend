import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0e27',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#fbbf24',
          dark: '#f59e0b',
        },
        card: {
          DEFAULT: '#1a1f3a',
          border: '#2d3554',
        },
      },
    },
  },
  plugins: [],
}
export default config