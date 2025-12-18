/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'farm-primary': '#166534', // green-800 - Deep Farm Green
                'farm-secondary': '#10b981', // emerald-500 - Vibrant Green
                'farm-accent': '#4ade80', // green-400 - Light Accent
                'farm-bg': '#f0fdf4', // green-50 - Very light green tint background
                'farm-dark': '#0f172a',
                'farm-card': '#ffffff',
                'farm-moss': '#688557',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
