module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          300: '#D2B48C',  // Light brown
          600: '#fb923c',  // Darker brown for buttons
          700: '#654321',  // Even darker brown for button hover states
        },
      },
    },
  },
  plugins: [],
}