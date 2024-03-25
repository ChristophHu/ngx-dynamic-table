/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    // './src/**/*.{html,ts,css,scss,sass,less,styl}',
    './projects/**/*.{html,ts,css,scss,sass,less,styl}'
  ],
  theme: {
    extend: {
      colors: {
        // menu
        menu        : 'var(--menu)',
        menu_light  : 'var(--menu-light)',
        menu_dark   : 'var(--menu-dark)',

        // background
        primary     : 'var(--primary)',
        secondary   : 'var(--secondary)',
        tertiary    : 'var(--tertiary)',
        accent      : 'var(--accent)',

        // text
        dark        : 'var(--dark)',
        darker      : 'var(--darker)',
        light       : 'var(--light)',
        lighter     : 'var(--lighter)',
        disabled    : 'var(--disabled)',
        placeholder : 'var(--placeholder)',
        static_gray : 'var(--static-gray)',
        icon        : 'var(--icon)',

        // border
        borderline  : 'var(--borderline)',

        // input
        label       : 'var(--label)',
        input       : 'var(--input)',
        icon        : 'var(--icon)'
      },
      width: {
        '128': '32rem',
      },
      zIndex: {
        '90': '90',
        '100': '100',
        '110': '110'
      }
    },
  },
  plugins: [
    plugin(function({ matchUtilities, theme }) {
      matchUtilities(
        {
          'bg-gradient': (angle) => ({
            'background': `repeating-linear-gradient(${angle}, transparent 0 19px, var(--tw-gradient-to) 19px 20px)`,
          }),
        },
        {
          // values from config and defaults you wish to use most
          values: Object.assign(
            theme('bgGradientDeg', {}), // name of config key. Must be unique
            {
              10: '10deg', // bg-gradient-10
              15: '15deg',
              20: '20deg',
              25: '25deg',
              30: '30deg',
              45: '45deg',
              60: '60deg',
              90: '90deg',
              120: '120deg',
              135: '135deg'
            }
          )
        }
       )
    })
  ],
}

