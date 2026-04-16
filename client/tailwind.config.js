/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        body:    ['"Exo 2"', 'sans-serif'],
      },
      colors: {
        neon: {
          blue:   '#3b82f6',
          purple: '#a855f7',
          cyan:   '#06b6d4',
          green:  '#10b981',
          pink:   '#ec4899',
        },
        dark: {
          900: '#05050d',
          800: '#0d0d1a',
          700: '#141428',
          600: '#1e1e38',
          500: '#2a2a4a',
        },
      },
      boxShadow: {
        neon: '0 0 20px rgba(168,85,247,0.4)',
        'neon-blue': '0 0 20px rgba(59,130,246,0.4)',
        'neon-cyan': '0 0 20px rgba(6,182,212,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow':  'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        glow: {
          from: { textShadow: '0 0 10px #a855f7, 0 0 20px #a855f7' },
          to:   { textShadow: '0 0 20px #3b82f6, 0 0 40px #3b82f6' },
        },
      },
    },
  },
  plugins: [],
};
