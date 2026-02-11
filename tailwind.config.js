/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        muted: "#F8FAFC",
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      keyframes: {
        // Pulse animations for ParameterCard
        'pulse-soft': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(234,179,8,.4)' },
          '50%': { boxShadow: '0 0 0 6px rgba(234,179,8,0)' },
        },
        'pulse-strong': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239,68,68,.6)' },
          '50%': { boxShadow: '0 0 0 10px rgba(239,68,68,0)' },
        },
        // Sparkline bar grow/shrink
        'bar-grow': {
          '0%': { transform: 'scaleY(0.02)' },  // minimum height
          '100%': { transform: 'scaleY(1)' },   // full height
        },
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s infinite',
        'pulse-strong': 'pulse-strong 1.4s infinite',
        'bar-grow': 'bar-grow 0.5s ease-out forwards',
      },
      transformOrigin: {
        'bottom': 'bottom', // needed so bars grow from bottom
      }
    },
  },
  plugins: [],
};
