
export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: "universal",
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "server",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: "%s",
    title: process.env.npm_package_name || "",
    meta: [{
        charset: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico"
      },
      {
        rel: "stylesheet",
        href: "http://at.alicdn.com/t/font_1956946_jhbqrt4xfc.css"
      }
    ]
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    {
      src: "~/plugins/util",
      ssr: true
    },
    {
      src: "~/plugins/http",
      ssr: true
    },
    "~/plugins/axios"
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios", "@nuxtjs/proxy", 'cookie-universal-nuxt'],
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  axios: {
    proxy: true, // 表示开启代理
    prefix: '/api', // 表示给请求url加个前缀 /api
    credentials: true // 表示跨域请求时是否需要使用凭证
  },
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:9017', // 目标接口域名
      changeOrigin: true, // 表示是否跨域
      pathRewrite: {
        '^/api': '/', // 把 /api 替换成‘’
      }
    }
  },
  vuetify:{},
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    vendor: ["vuelidate", "js-md5"],
    extractCSS: true,
    filenames: {
      app: ({ isDev }) => (isDev ? '[name].js' : 'js/[name].min.js'),
      css: ({ isDev }) => (isDev ? '[name].css' : 'css/[name].min.css'),
      chunk: ({ isDev }) => (isDev ? '[name].js' : 'js/[name].min.js'),
      img: ({ isDev }) => (isDev ? '[path][name].[ext]' : 'img/[name].[ext]')
    },
    postcss: {
      plugins: {
        autoprefixer: {
          overrideBrowserslist: [
            'last 2 version',
            'Android >= 4.0',
            'iOS >= 8',
            'ie >= 8'
          ]
        }
      }
    },
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    NODE_ENV: process.env.NODE_ENV
  },
  // loading: {
  //   height: "2px",
  //   color: "#0094ff"
  // }
  loading: false
};
