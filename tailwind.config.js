/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary dark palette
        axis: {
          950: '#0B0D12',
          900: '#11151D',
          850: '#161A24',
          800: '#181C25',
          700: '#1E2330',
          600: '#242A35',
          500: '#2D3441',
          400: '#3A4252',
          300: '#4A5366',
        },
        // Accent orange
        accent: {
          50: '#FFF3ED',
          100: '#FFE2D3',
          200: '#FFC5A8',
          300: '#FFA37A',
          400: '#FF8552',
          500: '#FF6B35',
          600: '#FF5A1F',
          700: '#E04A18',
          800: '#B83A12',
          900: '#8C2D0E',
        },
        // Neutral text
        ink: {
          50: '#F5F5F3',
          100: '#FFFFFF',
          200: '#D9D9D9',
          300: '#B0B4BE',
          400: '#777C86',
          500: '#5A5E68',
          600: '#3E424A',
        },
        // Status colors
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          critical: '#EF4444',
          info: '#3B82F6',
          pending: '#A855F7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
