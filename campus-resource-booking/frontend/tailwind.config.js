
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#0b0b0c', tint: '#f5f5f7', card: '#ffffff' },
      boxShadow: { elev: '0 10px 30px rgba(0,0,0,0.06)' },
      borderRadius: { xl2: '1.25rem' }
    },
    fontFamily: {
      sans: ['-apple-system','BlinkMacSystemFont','Inter','Segoe UI','Roboto','Helvetica Neue','Arial','Noto Sans','sans-serif']
    }
  },
  plugins: []
}
