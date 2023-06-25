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
      stripePublicKey: "",
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
    "nuxt-security",
  ],
  security: {
    headers: {
      crossOriginResourcePolicy: false,
      crossOriginOpenerPolicy: "same-origin",
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        "base-uri": ["'self'"],
        "font-src": ["'self'", "https:", "data:"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'self'"],
        "img-src": ["'self'", "data:"],
        "object-src": ["'none'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
        "upgrade-insecure-requests": true,
      },
      originAgentCluster: "?1",
      referrerPolicy: "no-referrer",
      strictTransportSecurity: {
        maxAge: 15552000,
        includeSubdomains: true,
      },
      xContentTypeOptions: "nosniff",
      xDNSPrefetchControl: "off",
      xDownloadOptions: "noopen",
      xFrameOptions: "SAMEORIGIN",
      xPermittedCrossDomainPolicies: "none",
      xXSSProtection: "0",
      permissionsPolicy: {
        camera: ["()"],
        "display-capture": ["()"],
        fullscreen: ["()"],
        geolocation: ["()"],
        microphone: ["()"],
      },
    },
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2000000,
      maxUploadFileRequestInBytes: 8000000,
    },
    rateLimiter: {
      // Twitter search rate limiting
      tokensPerInterval: 30,
      interval: "hour",
      fireImmediately: true,
    },
    xssValidator: {},
    corsHandler: {
      origin: "*",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      preflight: {
        statusCode: 204,
      },
    },
    allowedMethodsRestricter: "*",
    hidePoweredBy: true,
    basicAuth: false,
    enabled: true,
    csrf: false,
  },
  pinia: {
    autoImports: ["defineStore"],
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
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
  },
});
