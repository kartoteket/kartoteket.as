/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/

// get some of the default colors
const { colors } = require('tailwindcss/defaultTheme');

// theme colrs are generated from https://leonardocolor.io

module.exports = {
  theme: {
    colors: {
      transparent: colors.transparent,
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      blue: {
        '100': '#8d969e',
        '200': '#6d7884',
        '300': '#5e6b78',
        '400': '#515f6e',
        '500': '#475666',
        '600': '#3e4e5f',
        '700': '#374758',
        '800': '#2f4153',
        '900': '#2a3b4b'
      },
      cyan: {
        '100': '#4ca1ae',
        '200': '#4b94a1',
        '300': '#488792',
        '400': '#457b84',
        '500': '#427078',
        '600': '#3e646b',
        '700': '#3a5a60',
        '800': '#355156',
        '900': '#31474c'
      }
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
