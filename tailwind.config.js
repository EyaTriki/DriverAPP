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
        customGray: '#2F2F2F', 
      lightGrey:'#909090',
      bgGrey:'#F6F6F6',
      bgView:'#E5E5E5',//borders
      labels: '#7F8C8D',
      iconsImg:'#5C2DD3',
      green:'#439F6E',
      lgPurple:'#AF2EDD',
      lgBlue:"#1C8BCA",
      lgLightOrange:'#F6743E',
      lgDarkOrange:'#D42525',
      lgLightYellow:'#F8B806',
      lgDarkYellow:'#FF8C04',
      lgDarkBlue:'#2D82B2',
      lgLightBlue:'#329ABB',
      lgLightGreen:'#32BB71',
      lgDarkGreen:'#2A9D8F',
      croix:'#49454F'

      },
      fontSize: {
        xs: '12px',       
        sm: '13px',       
        base: '16px',     
        lg: '18px',      
        xl: '20px',      
        '2xl': '24px',   
       
      },
    },
  },
  plugins: [],
}

