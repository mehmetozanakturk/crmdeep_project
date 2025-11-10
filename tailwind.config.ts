import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007bff',
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c1ff',
          300: '#4da8ff',
          400: '#1a90ff',
          500: '#007bff',
          600: '#0056b3',
          700: '#004085',
          800: '#002b57',
          900: '#001529',
        },
        neutral: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        success: {
          DEFAULT: '#28a745',
          50: '#e6f9ea',
          500: '#28a745',
          600: '#1e7e34',
        },
        danger: {
          DEFAULT: '#dc3545',
          50: '#fde8ea',
          500: '#dc3545',
          600: '#c82333',
        },
        warning: {
          DEFAULT: '#ffc107',
          50: '#fff8e1',
          500: '#ffc107',
          600: '#e0a800',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
