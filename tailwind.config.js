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
      gray: colors.gray,
      white: {
        '100': 'rgba(255,255,255, 0.1)',
        '200': 'rgba(255,255,255, 0.2)',
        '300': 'rgba(255,255,255, 0.3)',
        '400': 'rgba(255,255,255, 0.4)',
        '500': 'rgba(255,255,255, 0.5)',
        '600': 'rgba(255,255,255, 0.6)',
        '700': 'rgba(255,255,255, 0.7)',
        '800': 'rgba(255,255,255, 0.8)',
        '900': 'rgba(255,255,255, 0.9)',
        full: '#ffffff'
      },
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
      },
      orange: {
        '100': '#fff5eb',
        '200': '#fee6ce',
        '300': '#fdd0a2',
        '400': '#fdae6b',
        '500': '#fd8d3c',
        '600': '#f16913',
        '700': '#d94801',
        '800': '#a63603',
        '900': '#7f2704'
      }
    },
    extend: {
      opacity: {
        90: '0.9'
      },
      screens: {
        xxl: '1600px',
        'max-sm': { max: '639px' }
      }
    }
  },
  variants: {},
  plugins: []
};
