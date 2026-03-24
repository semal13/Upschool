/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        talya: {
          purple: '#BFA8E2',
          purpleDark: '#a188cd',
          lilac: '#E8E0F5',
          paleYellow: '#FDFBF7',
          lightTurquoise: '#E0F2F1',
          cream: '#faf8f5',
          sage: '#98ab90',
          text: '#4a3f5e',
          accent: '#8B5CF6'
        }
      },
      boxShadow: {
        'clay': '0 10px 40px -10px rgba(131, 115, 155, 0.15)',
        'glass-inner': 'inset 0 0px 8px 0 rgba(255, 255, 255, 0.9)',
        'purple-glow': '0 8px 30px rgba(191, 168, 226, 0.35)',
      },
      backgroundImage: {
        'talya-gradient': 'linear-gradient(135deg, #F9DDE8 0%, #E2ECF9 45%, #FEF9DF 100%)',
        'night-gradient': 'linear-gradient(160deg, #1A1B4B 0%, #1E293B 45%, #020617 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
