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
    '@pinia/nuxt'
  ],
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
