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
    '@vite-pwa/nuxt',
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
  pwa: {
    scope: '/',
    registerWebManifestInRouteRules: true,
    registerType: 'autoUpdate',
    manifest: {
      name: 'Hospital ERP',
      short_name: 'Hospital ERP',
      description: 'Hệ thống quản lý kho bệnh viện',
      theme_color: '#ffffff',
      icons: [],
      id: 'hospital-erp',
      start_url: '/',
      display: 'standalone',
    },
    workbox: {
      globPatterns: [
        '**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot}',
        'manifest.webmanifest',
      ],
      globDirectory: '.output/public',
      globIgnores: [
        '**/node_modules/**/*',
        'sw.js',
        'workbox-*.js',
        '**/firebase-messaging-sw.js',
      ],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /\/_nuxt\/.*$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'nuxt-static',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
            },
          },
        },
        {
          urlPattern: /\/api\/.*$/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24, // 1 day
            },
          },
        },
        {
          urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'firebase-storage-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24, // 1 day
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
      navigateFallback: null,
      cleanupOutdatedCaches: true,
      sourcemap: false,
    },
    devOptions: {
      enabled: true,
      type: 'module',
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
    },
  },
  app: {
    head: {
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
