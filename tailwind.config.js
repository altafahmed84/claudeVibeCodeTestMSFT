/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          background: '#1a2332',
          backgroundSecondary: '#243447',
          surface: '#2d4356',
          surfaceElevated: '#364a5f'
        },
        timeline: {
          gradientStart: '#4ecdc4',
          gradientMid: '#44a08d',
          gradientEnd: '#6b73ff',
          milestoneActive: '#4ecdc4',
          milestoneInactive: '#6b7280',
          connectionLine: '#374151'
        },
        text: {
          primary: '#ffffff',
          secondary: '#d1d5db',
          muted: '#9ca3af',
          accent: '#4ecdc4'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}