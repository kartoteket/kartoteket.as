import routes from './utils/routes';

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
    titleTemplate: chunk => (chunk ? `${chunk} - Kartoteket` : 'Kartoteket'), // If undefined or blank then we don't need the hyphen
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Kartoteket is a studio that creates websites, data visualisations and data driven maps. We specialize in performance, accessibility and SEO'
      },
      { name: 'format-detection', content: 'telephone=no' },
      {
        property: 'og:site_name',
        content: 'Kartoteket'
      },
      {
        property: 'og:type',
        content: 'Kartoteket'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://kartoteket.as/preview1.png'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: '',
        template: chunk => (chunk ? `${chunk} - Kartoteket` : 'Kartoteket')
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://kartoteket.as'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'Kartoteket is a studio that creates websites, data visualisations and data driven maps. We specialize in performance, accessibility and SEO'
      },
      {
        property: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        property: 'twitter:site',
        content: '@3x5Kartoteket'
      }
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

  buildModules: [
    [
      '@nuxtjs/axios',
      '@nuxtjs/google-analytics',
      {
        id: 'UA-60185757-1'
      }
    ]
  ],

  /*
  ** Nuxt.js modules
  */
  modules: ['@nuxtjs/pwa', 'nuxt-sanity', '@nuxtjs/tailwindcss'],

  sanity: {
    projectId: 'kqscd500', // string, required
    dataset: 'production', // string, required
    token: '', // string, optional
    useCdn: true // boolean, optional, default is false
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
  },
  generate: {
    // interval: 100,
    routes: routes
  }
};
