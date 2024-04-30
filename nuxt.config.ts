// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path";
export default defineNuxtConfig({
  // app:{
  //   head: {
  //     script: [
  //       {
  //         src: process.env.GOOGLE_MAP_BASE_URL,
  //       },
  //     ],
  //   },
  // },
  devtools: { enabled: false },
  modules: ["@pinia/nuxt", "@nuxt/ui"],
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
  
  // alias: {
  //   "@": resolve(__dirname, "/"),
  //   "@assets": resolve(__dirname, "/assets"),
  // },

  imports: {
    dirs: ["./stores/**"],
  },
  ssr: false,
})