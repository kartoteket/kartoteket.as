const pkg = require('./package');

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    htmlAttrs: {
      lang: 'en'
    },
    title: '', // craches ie11 if not set
    titleTemplate: titleChunk => {
      // If undefined or blank then we don't need the hyphen
      return titleChunk ? `${titleChunk} - Kartoteket` : 'Kartoteket';
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Kartoteket is a studio that creates websites, data visualisations and data driven maps. We specialize in performance, accessibility and SEO'
      },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Page Transitions
  */
  pageTransition: {
    name: 'layout',
    mode: 'out-in'
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['~/plugins/global.js'],

  buildModules: [],

  /*
  ** Nuxt.js modules
  */
  modules: ['@nuxtjs/pwa', 'nuxt-sanity', '@nuxtjs/tailwindcss'],

  sanity: {
    projectId: 'kqscd500', // string, required
    dataset: 'production', // string, required
    token: '', // string, optional
    useCdn: false // boolean, optional, default is false
  },

  // ref fix: https://github.com/nuxt-community/tailwindcss-module/issues/52
  tailwindcss: {
    purgeCSSInDev: process.env.NODE_ENV === 'production'
  },

  purgeCSS: {
    whitelistPatterns: [
      /-(leave|enter|appear)(|-(to|from|active))$/,
      /^nuxt-link(|-exact)-active$/
    ]
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    },
    extractCSS: true,
    postcss: {
      // Add plugin names as key and arguments as value
      // Install them before as dependencies with npm or yarn
      plugins: {
        // Disable a plugin by passing false as value
        'postcss-import': { from: 'assets/css/tailwind.css' }
        // 'postcss-url': false,
        // 'postcss-nested': {},
        // 'postcss-responsive-type': {},
        // 'postcss-hexrgba': {}
      }
    }
  }
};
