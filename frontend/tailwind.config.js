/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['pretendard'],
      },
      width: {
        inherit: 'inherit',
      },
      colors: {
        c_button_gray: '#cdced6',
        c_border_gray: '#e8e8ee',
        c_textarea_gray: '#f9f9f9',
        c_background_gray: '#fffff',
        c_placeholder_gray: '#858899',
        c_strong_black: '#000000',
        c_description_gray: '#3E404c',
        c_bg_blue: '#00a3ff',
        c_marker_RED: '#FF8080',
        c_marker_ORANGE: '#FFB780',
        c_marker_YELLOW: '#FFE480',
        c_marker_GREEN: '#7FC782',
        c_marker_BLUE: '#80A6FF',
        c_marker_PURPLE: '#DD80FF',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};
