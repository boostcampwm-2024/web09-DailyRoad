/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        inherit: 'inherit',
      },
      colors: {
        c_button_gray: '#cdced6',
        c_textarea_gray: '#f9f9f9',
        c_background_gray: '#fffff',
        c_placeholder_gray: '#858899',
        c_strong_black: '#000000',
        c_description_gray: '#3E404c',
        c_bg_blue: '#00a3ff',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
