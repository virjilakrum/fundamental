/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        primary: '#FFFFFF',
        secondary: '#6B48FF',
        accent: '#00F5D4',
        urgent: '#FF4848',
        background: '#0A0A0A',
        'card-bg': '#1A1A1A',
        'primary-text': '#FFFFFF',
        'secondary-text': '#FFFFFF',
        'muted-text': 'rgba(255,255,255,0.6)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6B48FF 0%, #00F5D4 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #1A1A1A 0%, #6B48FF 100%)',
      },
    },
  },
  plugins: [],
};