module.exports = {
  purge: ['./public/index.html', './src/**/!(tailwind).{ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
