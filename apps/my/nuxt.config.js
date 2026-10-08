// https://nuxt.com/docs/api/configuration/nuxt-config
const isDev = process.env.NODE_ENV === 'development'
import { loadEnv } from 'vite'

const envScript = process.env.npm_lifecycle_script.split(' ')
const envName = envScript[envScript.length - 1]
const envData = loadEnv(envName, 'env')

console.log('当前环境：', envData)

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: envData
  },
  vite: {
    envDir: '~/env', // 指定env文件夹
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/css/element/index.scss" as element;`,
        },
      },
    },
  },
  modules: [
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],
  // PWA 配置：仅做「可安装」能力
  // - manifest 提供应用信息与图标
  // - Service Worker 只预缓存静态资源，不接管页面导航、不缓存任何接口请求
  // - 更新策略为 prompt，由 PwaUpdatePrompt 组件提示用户刷新，避免用户停留在旧代码
  pwa: {
    registerType: 'prompt',
    // 复用模块默认的 false：由 @vite-pwa/nuxt 的客户端插件负责注册 SW，
    // 不再额外注入注册脚本，避免重复注册
    injectRegister: false,
    manifest: {
      // 与 distribution 端隔离：手机上可能同时安装两个 PWA，
      // 名称必须可区分（浏览器安装弹窗、桌面图标名均取此字段）
      name: 'Flylinking-My',
      short_name: 'Flylinking-My',
      description: 'Flylinking-My',
      start_url: '/',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#ffffff',
      theme_color: '#5548ff',
      lang: 'en',
      icons: [
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
      // 置为 null 以覆盖模块的默认值（默认回退到 baseURL），
      // 即不接管页面导航请求，断网时不做离线页面兜底
      navigateFallback: null,
      runtimeCaching: []
    },
    client: {
      // 开启后可由 $pwa.showInstallPrompt / $pwa.install() 接管安装引导
      installPrompt: true
    },
    devOptions: {
      // 开发环境不启用 SW，避免本地调试时命中缓存
      enabled: false
    }
  },
  css: [
    '@flylinking/ui/styles/css/reset.css',
    '@flylinking/ui/styles/css/global.scss',
  ],
  nitro: {
    storage: {
      db: {
        driver: 'fs',
        base: './.data/db'
      }
    }
  },
  routeRules: {
    // '/goods/**': {
    //   cache: isDev ? {} : {
    //     base: "db",
    //   },
    //   swr: isDev ? 0 : 180 // 180秒 = 3分钟
    // }
    // Service Worker 必须始终取到最新版本，否则用户会被旧缓存卡在旧代码上
    '/sw.js': {
      headers: { 'cache-control': 'no-cache, no-store, must-revalidate' }
    },
    '/manifest.webmanifest': {
      headers: { 'cache-control': 'no-cache' }
    }
  },
  build: {
    analyze: {
      filename: "stats.html",
    },
    extractCSS: true,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 80,
  },
  app: {
    pageTransition: { name: 'fade-transform', mode: 'out-in' }
  },
  elementPlus: {
    // icon: 'ElIcon',
    importStyle: 'scss',
    // themes: ['dark'],
  },
})
