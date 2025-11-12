/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#13795B',
          accent: '#F59E0B',
          surface: '#FFF9F0',
          text: '#0F172A',
          muted: '#64748B',
        },
      },
    },
  },
  plugins: [],
};
