/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Defining some premium colors
        'farm-dark': '#0f172a', // Slate 900
        'farm-card': '#1e293b', // Slate 800
        'farm-accent': '#10b981', // Emerald 500
        'farm-alert': '#ef4444', // Red 500
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
