/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#040705',
          dark: '#0a100d',
          card: '#0f1712',
          border: '#1a2b1f',
          accent: '#bfff00', /* DOTDNA Lime Green */
          accentHover: '#ccfc3d',
          cyan: '#00e5ff',
          green: '#bfff00', /* using accent for green */
          blue: '#1a6fff',
          red: '#ff3d6b',
          yellow: '#ffcc00',
          purple: '#a855f7',
          muted: '#6a7d72',
          text: '#c9dad0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'glow-green': 'radial-gradient(circle, rgba(191,255,0,0.08) 0%, transparent 70%)',
        'glow-mesh': 'radial-gradient(ellipse at top, rgba(191,255,0,0.15), transparent 50%), radial-gradient(ellipse at bottom right, rgba(191,255,0,0.08), transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(191,255,0,0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(191,255,0,0.6), 0 0 40px rgba(191,255,0,0.1)' },
        },
      },
    },
  },
  plugins: [],
};
