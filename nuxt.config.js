const pkg = require('./package')

const webpack = require('webpack')
const axios = require('axios')
const MM_API_URL = 'https://api.mallmaverick.com/properties/182/'
const MM_API_HOST = 'https://api.mallmaverick.com'
const API_KEY = '6c36171ab3f3b2c5b734ac841bc078b4'

module.exports = {
    mode: 'spa',
    /* Headers of the page */
    head: {
        title: pkg.name,
        htmlAttrs: {
            lang: 'en-US'
        },
        meta: [{
                charset: 'utf-8'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: pkg.description
            },
            {
                name: 'author',
                content: ''
            }, //UPDTAE AUTHOR
            {
                name: 'application-name',
                content: ''
            }, //UPDATE APPLICATION NAME
            {
                hid: 'twitter',
                name: 'twitter:card',
                content: 'summary'
            },
            {
                hid: 'og:type',
                name: 'og:type',
                content: 'website'
            }
        ],
        link: [{
            rel: 'icon',
            type: 'image/x-icon',
            href: '/favicon.ico'
        }, {
            rel: 'stylesheet',
            href: 'https://cdn.jsdelivr.net/npm/vue2-animate@1.0.4/dist/vue2-animate.min.css'
        }]
    },

    /* Set your environment variables here */
    env: {
        MM_API_URL: MM_API_URL,
        MM_API_HOST: MM_API_HOST,
        API_KEY: API_KEY
    },
    /* Customize the progress-bar color */
    loading: {
        color: '#FFFFFF',
        height: '5px'
    },

    /* Custom loading page */
    /*
    loadingIndicator: {
      name: '~/assets/loading.html',
      color: '#000',
      background: 'white'
    },
    */

    /* Global CSS */
    css: ['~/assets/stylesheets/main.scss'],

    /* Plugins to load before mounting the App */
    plugins: [
        '~/plugins/es6-shim.js',
        '~/plugins/init-data.js',
        '~/plugins/vue-moment.js',
        '~/plugins/vue-lazyload.js',
        '~/plugins/vee-validate.js',
        '~/plugins/main.js'
    ],

    /* Nuxt.js modules */
    modules: [,
        // Doc: https://bootstrap-vue.js.org/docs/
        'bootstrap-vue/nuxt',
        'nuxt-vuex-router-sync',
        '@nuxtjs/google-analytics',
        '@nuxtjs/sitemap'
    ],

    /* Google Analytics */
    'google-analytics': {
        id: 'UA-69974835-8'
    },

    /* Sitemap Configuration */
    sitemap: {
        generate: true,
        hostname: '', // UPDATE HOST NAME
        routes() {
            return axios.get(MM_API_URL + '/site_map_data').then(res =>
                res.data.meta_data
                .filter(md => {
                    if (md.path != null && md.path != undefined) return true
                })
                .map(md => md.path)
                .sort()
                .map(currRoute => {
                    return {
                        url: currRoute,
                        changefreq: 'daily',
                        priority: 1,
                        lastmodISO: new Date().toISOString()
                    }
                })
            )
        }
    },

    /* Build configuration */
    build: {
        /* You can extend webpack config here */
        extend(config, ctx) {},
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                _: 'lodash'
                    // ...etc.
            })
        ]
    }
}