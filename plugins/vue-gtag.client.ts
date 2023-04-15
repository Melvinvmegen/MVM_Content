import VueGtag, { trackRouter } from 'vue-gtag-next'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGtag, {
    property: {
      id: 'G-E4REJVCG77',
      params : {
        send_page_view : true,
      }
    }
  })
  trackRouter(useRouter())
})