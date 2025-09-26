import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

const pinia = createPinia()

// 1. Definição do nosso tema personalizado
const keeperTheme = {
  dark: true,
  colors: {
    background: '#111827', // Um cinza-azulado escuro
    surface: '#1F2937',    // Cor dos cards
    primary: '#3B82F6',    // Azul vibrante para destaque
    success: '#10B981',    // Verde
    error: '#EF4444',      // Vermelho
  }
}

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'keeperTheme', // 2. Usar o nosso tema como padrão
    themes: {
      keeperTheme, // 3. Registar o tema
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
})

createApp(App)
  .use(vuetify)
  .use(pinia)
  .mount('#app')