/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/

// get some of the default colors

const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      'dark-blue': '#2C3E50',
      cyan: '#4CA1AF'
    },
    extend: {
      opacity: {
        90: '0.9'
      }
    }
  },
  variants: {},
  plugins: []
};
