// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path";
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
  devtools: { enabled: false },
  modules: ["@pinia/nuxt", "@nuxt/ui", (_options, nuxt) => {
    nuxt.hooks.hook('vite:extendConfig', (config) => {
      // @ts-expect-error
      config.plugins.push(vuetify({ autoImport: true }))
    })
  },
  ],
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    }
  },
  
  // alias: {
  //   "@": resolve(__dirname, "/"),
  //   "@assets": resolve(__dirname, "/assets"),
  // },
  runtimeConfig: {
    public: {
      PLACE_BASE_URL: process.env.PLACE_BASE_URL,
    }
  },

  imports: {
    dirs: ["./stores/**"],
  },
  ssr: false,
})