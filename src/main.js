// main.js

import { createApp } from 'vue'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

// --- ADICIONAR CONFIGURAÇÃO DE TEMA AQUI ---
const vuetify = createVuetify({
  components,
  directives,
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