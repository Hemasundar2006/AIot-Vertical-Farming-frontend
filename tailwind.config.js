/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Traditional Farmer/Rustic Theme
                'farm': {
                    'soil': '#8B6F47',      // Rich brown soil
                    'dirt': '#6B4E3D',      // Dark earth
                    'wheat': '#D4A574',     // Golden wheat
                    'corn': '#F4A460',      // Corn yellow
                    'barn': '#8B4513',      // Barn red-brown
                    'wood': '#A0826D',      // Weathered wood
                    'straw': '#E6D5B8',     // Straw/hay
                    'cream': '#F5E6D3',     // Cream/off-white
                    'sage': '#9CAF88',      // Sage green
                    'olive': '#6B7F3A',     // Olive green
                },
                'earth': {
                    50: '#faf7f0',   // Light cream
                    100: '#f5ede0',  // Pale tan
                    200: '#ead9c1',  // Light brown
                    300: '#dcc19a',  // Tan
                    400: '#c9a373',  // Medium brown
                    500: '#b88a5a',  // Rich brown
                    600: '#a6754a',  // Dark brown
                    700: '#8a5f3f',  // Deep brown
                    800: '#714e38',  // Very dark brown
                    900: '#5d4030',  // Almost black brown
                },
                'harvest': {
                    50: '#fff8e1',   // Light golden
                    100: '#ffecb3',  // Pale gold
                    200: '#ffe082',  // Light yellow
                    300: '#ffd54f',  // Golden yellow
                    400: '#ffca28',  // Bright gold
                    500: '#ffc107',  // Amber gold
                    600: '#ffb300',  // Deep gold
                    700: '#ffa000',  // Orange gold
                    800: '#ff8f00',  // Dark orange
                    900: '#ff6f00',  // Deep orange
                },
                'barn': {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 3s infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(34, 197, 94, 0.5)' },
                    '100%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
            backgroundImage: {
                'gradient-farm': 'linear-gradient(135deg, #8B6F47 0%, #A0826D 50%, #D4A574 100%)',
                'gradient-earth': 'linear-gradient(135deg, #6B4E3D 0%, #8B6F47 50%, #A0826D 100%)',
                'gradient-harvest': 'linear-gradient(135deg, #D4A574 0%, #F4A460 50%, #FFC107 100%)',
                'gradient-wood': 'linear-gradient(135deg, #8B6F47 0%, #A0826D 50%, #C9A373 100%)',
                'texture-wood': 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 111, 71, 0.03) 2px, rgba(139, 111, 71, 0.03) 4px)',
                'texture-burlap': 'radial-gradient(circle at 2px 2px, rgba(139, 111, 71, 0.1) 1px, transparent 0), radial-gradient(circle at 1px 1px, rgba(107, 78, 61, 0.05) 1px, transparent 0)',
            },
            boxShadow: {
                'farm': '0 4px 20px -4px rgba(139, 111, 71, 0.4), 0 2px 8px rgba(107, 78, 61, 0.2)',
                'farm-lg': '0 8px 30px -6px rgba(139, 111, 71, 0.5), 0 4px 12px rgba(107, 78, 61, 0.3)',
                'earth': '0 4px 20px -4px rgba(107, 78, 61, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
                'rustic': '0 2px 8px rgba(107, 78, 61, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            },
        },
    },
    plugins: [],
}
