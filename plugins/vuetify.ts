import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // pre-build css styles

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            primary: "#000000",
            secondary: "#F9D262",
            third: "#FFC680",
            accent: "#F9E19C",
            error: "#f44336",
            warning: "#ff8c00",
            info: "#03a9f4",
            success: "#4caf50",
          }
        },
        light: {
          colors: {
            primary: "#07327B",
            secondary: "#00bea5",
            accent: "#1E1F6D",
            error: "#d93125",
            warning: "#dd6f10",
            info: "#008ac8",
            success: "#0e9f14",
          }
        },
      },
    },

  });

  nuxtApp.vueApp.use(vuetify);
});