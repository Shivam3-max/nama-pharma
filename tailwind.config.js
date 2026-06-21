/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:   { DEFAULT: '#F7F3ED', deep: '#EFE9DF', card: '#FDFAF6' },
        gold:    { DEFAULT: '#B8922A', bright: '#D4A843', muted: '#C9A84C', pale: '#F0E4C8' },
        sage:    { DEFAULT: '#4A6741', light: '#6B8F63', pale: '#EBF0E8' },
        ink:     { DEFAULT: '#1E1A14', soft: '#3D3429' },
        muted:   '#7A6952',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans:    ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'float': 'floatY 6s ease-in-out infinite',
        'shimmer': 'shimmerGold 3s linear infinite',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #A07820 0%, #D4A843 50%, #A07820 100%)',
        'cream-gradient': 'linear-gradient(180deg, #F7F3ED 0%, #FDFAF6 100%)',
      },
    },
  },
  plugins: [],
}
