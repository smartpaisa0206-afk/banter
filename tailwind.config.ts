import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0b12',
        surface: '#12121c',
        muted: '#8b8ba7',
        brand: {
          DEFAULT: '#7c5cff',
          soft: '#a78bfa',
          deep: '#5b3df5',
        },
        gold: '#e9c46a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 10px 40px -12px rgba(124,92,255,0.45)',
        card: '0 8px 30px -12px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(1200px 600px at 10% 10%, rgba(124,92,255,0.18), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(233,196,106,0.12), transparent 55%), radial-gradient(800px 600px at 50% 100%, rgba(167,139,250,0.14), transparent 60%)',
      },
    },
  },
  plugins: [],
};

export default config;
