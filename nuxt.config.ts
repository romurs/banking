// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
    host: '127.0.0.1',   // вместо localhost
    port: 3000
  },

  modules: [
    '@nuxt/eslint',
    // '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],

  pinia: {
    storesDirs: ['./stores/**'], 
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['pinia'],
      },
    },
  },
})