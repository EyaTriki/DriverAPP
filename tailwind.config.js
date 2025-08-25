/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primaryGreen: '#8CC044',
        borderGreen: '#5C8326',
        primaryGreenOpacity18: 'rgba(140, 192, 68, 0.18)', // 8CC044 avec 18% d'opacité
        white: '#FFFFFF',
        black: '#000000',
        gray: '#787676',
        GrayOpacity50: ' rgba(140, 192, 68, 0.5)',
        lightGray: '#E0E0E0',
        background: '#F5F5F5',
        error: '#FF3B30',
        success: '#4CD964',
        containerGray: '#DEE8ED',
        backgroundScreen: '#F6F8FA',
        orange: '#EDA10D',
        orangebck: '#EDA10D29',
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',

      },
      fontFamily: {
        poppins: ['Poppins-Regular'],
        'poppins-regular': ['Poppins-Regular'],
        'poppins-bold': ['Poppins-Bold'],
        'poppins-medium': ['Poppins-Medium'],
        'poppins-semibold': ['Poppins-SemiBold'],
      },
    },
  },
  plugins: [],
}

