import { ThemedColors } from './src/constants/color.constants'

const isDevelopment = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src/',
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      failOnError: false,
    },
    storage: {
      data: { driver: 'memory' },
      cache: { driver: 'memory' },
    },
    experimental: {
      asyncContext: true,
      typescriptBundlerResolution: true,
    },
  },
  devtools: { enabled: isDevelopment },
  compatibilityDate: '2025-05-15',
  modules: [
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
    'vue-sonner/nuxt',
    [
      'vuetify-nuxt-module',
      {
        autoImport: true,
      },
    ],
  ],
  vuetify: {
    moduleOptions: {
      styles: {
        configFile: 'assets/styles/vuetify.scss',
      },
    },
    vuetifyOptions: {
      defaults: {
        global: {
          ripple: true,
        },
        VBtn: {
          class: ['text-none'],
        },
        VTextField: {
          bgColor: 'erp-gray-100',
        },
        VTextarea: {
          bgColor: 'erp-gray-100',
        },
        VSelect: {
          itemTitle: 'label',
          itemValue: 'value',
          noDataText: 'Không có dữ liệu',
          loadingText: 'Đang tải dữ liệu...',
          bgColor: 'erp-gray-100',
        },
        VAutocomplete: {
          noDataText: 'Không có dữ liệu',
          loadingText: 'Đang tải dữ liệu...',
          bgColor: 'erp-gray-100',
        },
        VDateInput: {
          prependIcon: null,
          appendInnerIcon: 'mdi-calendar',
          bgColor: 'erp-gray-100',
        },
        VImg: {
          lazy: true,
          cover: true,
          aspectRatio: 1,
          lazySrc: '/assets/images/loading.gif',
        },
        VDialog: {
          opacity: 0.6,
        },
        VDataTable: {
          mobileBreakpoint: 'sm',
          noDataText: 'Không có dữ liệu',
          loadingText: 'Đang tải dữ liệu...',
        },
      },
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: ThemedColors,
          },
        },
      },
      icons: {
        defaultSet: 'custom',
      },
    },
  },
  icon: {
    serverBundle: 'remote',
    clientBundle: {
      scan: true,
      sizeLimitKb: 0,
      includeCustomCollections: true,
    },
    customCollections: [
      {
        prefix: 'custom',
        dir: './src/assets/icons',
      },
    ],
  },
  app: {
    head: {
      bodyAttrs: {
        class: 'erp-scrollbar',
      },
      title: 'Hospital ERP',
      meta: [
        {
          name: 'description',
          content: 'Hospital ERP - Hệ thống quản lý kho bệnh viện',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },

        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          crossorigin: 'anonymous',
          href: 'https://fonts.gstatic.com',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair:ital,opsz,wght@0,5..1200,300..900;1,5..1200,300..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
        },
      ],
    },
  },
  dir: {
    public: '../public',
  },
  components: [
    {
      path: '~/components/layouts',
      prefix: 'Layout',
    },
    {
      path: '~/components/features',
      prefix: 'Feature',
    },
    {
      path: '~/components/forms',
      prefix: 'Form',
    },
    {
      path: '~/components/common',
      prefix: 'Common',
    },
  ],
  css: ['~/assets/styles/main.scss'],
  typescript: {
    typeCheck: true,
    strict: false,
  },
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/base/_variables.scss" as *;',
        },
      },
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
    },
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth',
      strict: false,
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  experimental: {
    typedPages: true,
    payloadExtraction: false,
  },
  vue: { propsDestructure: true },
  runtimeConfig: {
    public: {
      nodeEnv: process.env.NODE_ENV,
      vapidKey: process.env.VAPID_KEY,
      wsBaseUrl: process.env.WS_BASE_URL,
      apiBaseUrl: process.env.API_BASE_URL,
    },
  },
})
