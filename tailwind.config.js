/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050816',
        card: '#0F172A',
        card2: '#1E293B',
        primary: '#2563EB',
        secondary: '#38BDF8',
        accent: '#22D3EE',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'Impact', 'Arial Narrow', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(56,189,248,.25), 0 10px 40px -10px rgba(37,99,235,.55)',
        premium: '0 1px 0 rgba(255,255,255,.04) inset, 0 20px 50px -20px rgba(0,0,0,.8)',
      },
    },
  },
  plugins: [],
};
