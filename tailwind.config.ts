import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        surface: '#0a0a0f',
        muted: '#8b8ba7',
        brand: {
          DEFAULT: '#2c3480',
          soft: '#8b9bf0',
          deep: '#1e2456',
          vivid: '#4c6fff',
        },
        gold: '#e9c46a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 10px 40px -12px rgba(76,111,255,0.5)',
        card: '0 8px 30px -12px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(1200px 600px at 10% 10%, rgba(44,52,128,0.25), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(233,196,106,0.12), transparent 55%), radial-gradient(800px 600px at 50% 100%, rgba(76,111,255,0.16), transparent 60%)',
      },
    },
  },
  plugins: [],
};

export default config;
