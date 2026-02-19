// https://nuxt.com/docs/api/configuration/nuxt-config

import open from 'open'
import path from 'path'
import fs from 'fs'
import glslify from "vite-plugin-glslify";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  vite: {
    server: {
      host: true
    }
  },
  app: {
    baseURL: '/',
    head: {
      title: 'lab.nulldesign.jp',
      description: 'passing time to the death',
      htmlAttrs: {
        lang: 'ja'
      },
      bodyAttrs: {
        class: ''
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'robots', content: 'noindex' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'crossorigin' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Zen+Kaku+Gothic+New:wght@300;400;500;700;900&Noto+Sans+JP:wght@300;400;500;700&display=swap' }
      ]
    },
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/foundation/common.styl',
    '~/assets/css/foundation/component.styl'
  ],
  //  コンポーネントの自動読み込み
  components: true,
  nitro: {
    output: {
      publicDir: path.join(__dirname, '/docs/')
    },
  },
  vite: {
    plugins: [
      glslify()
    ],
    css: {
      preprocessorOptions: {
        stylus: {
          imports: [
            path.resolve(__dirname, 'app/assets/css/mixins/index.styl')
          ]
        }
      }
    },
    // server: {
    //   watch: {
    //     // ファイル変更をチェックする間隔（ミリ秒）
    //     interval: 100,
    //     // OSのイベントではなくポーリングを使用するか（Docker環境などで有効）
    //     usePolling: true,
    //     // 監視から除外するディレクトリ
    //     ignored: ['**/node_modules/**', '**/dist/**']
    //   },
    //   hmr: {
    //     // HMRの接続待機時間（ミリ秒）
    //     timeout: 30000
    //   }
    // }
  },
  build: {
    transpile: ['three'],
  },
  // 実験的機能
  experimental: {
    // View Transitions APIの有効フラグ
    viewTransition: true
  }
})

