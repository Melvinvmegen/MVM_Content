import vuetify from "vite-plugin-vuetify";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    openaiApiKey: "",
    recaptchaSecretKey: "",
    basicAuthFinanceUrl: "http://localhost:8080/api/payment",
    basicAuthFinanceUser: "",
    basicAuthFinancePassword: "",
    webhookUser: "",
    webhookPassword: "",
    public: {
      recaptchaSiteKey: "",
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    /* Treeshaking: https://next.vuetifyjs.com/en/features/treeshaking/ */
    async (options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config?.plugins?.push(vuetify());
      });
    },
    "nuxt-purgecss",
    "nuxt-icon",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
  ],
  pinia: {
    autoImports: [
      'defineStore',
    ],
  },
  purgecss: {
    content: ["modules/purgecss/static-generated-html/**/*.html"],
    enabled: false,
    keyframes: true,
    safelist: {
      standard: [
        "body",
        "html",
        "nuxt-progress",
        /v-application-*/,
        /v-footer-*/,
        /v-list-*/,
        /v-btn*/,
        /v-toolbar*/,
        /grow-*/,
        /v-navigation*/,
        /elevation-*/,
        /v-icon*/,
        /mdi*/,
        /v-field*/,
        /v-input*/,
        /v-label*/,
        /v-overlay*/,
        /v-card*/,
        /v-snackbar*/,
      ],
    },
  },
  nuxtIcon: {
    size: "24px",
    class: "icon",
  },
});
