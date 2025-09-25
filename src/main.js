// main.js

import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

// --- ADICIONAR CONFIGURAÇÃO DE TEMA AQUI ---
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark', // Define o tema escuro como padrão
  },
  icons: {
    defaultSet: 'mdi',
  },
})

createApp(App)
  .use(vuetify)
  .mount('#app')