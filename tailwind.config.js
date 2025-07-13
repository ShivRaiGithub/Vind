/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          50: '#e6fffe',
          100: '#ccfffd',
          200: '#99fffb',
          300: '#66fff9',
          400: '#33fff7',
          500: '#00F0FF', // Main primary color
          600: '#00c0cc',
          700: '#009099',
          800: '#006066',
          900: '#003033',
        },
        secondary: {
          50: '#e6f3ff',
          100: '#cce7ff',
          200: '#99cfff',
          300: '#66b7ff',
          400: '#339fff',
          500: '#1E90FF', // Second primary color
          600: '#1873cc',
          700: '#125699',
          800: '#0c3a66',
          900: '#061d33',
        },
        accent: {
          50: '#f7e6ff',
          100: '#efccff',
          200: '#df99ff',
          300: '#cf66ff',
          400: '#bf33ff',
          500: '#BF00FF', // Highlight/secondary color
          600: '#9900cc',
          700: '#730099',
          800: '#4d0066',
          900: '#260033',
        },
        // Keep existing neutral colors for text and backgrounds
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      backgroundImage: {
        'vind-gradient': 'linear-gradient(90deg, #00F0FF 0%, #1E90FF 100%)',
        'vind-gradient-vertical': 'linear-gradient(180deg, #00F0FF 0%, #1E90FF 100%)',
        'vind-gradient-diagonal': 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
        'vind-accent-gradient': 'linear-gradient(90deg, #BF00FF 0%, #1E90FF 100%)',
        'vind-full-gradient': 'linear-gradient(45deg, #00F0FF 0%, #1E90FF 50%, #BF00FF 100%)',
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
        'vind-pulse': 'vind-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        'vind-pulse': {
          '0%, 100%': { 
            filter: 'brightness(1) saturate(1)',
          },
          '50%': { 
            filter: 'brightness(1.1) saturate(1.2)',
          },
        },
      },
    },
  },
  plugins: [],
}
