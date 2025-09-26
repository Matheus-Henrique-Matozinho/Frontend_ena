import { createApp } from 'vue'
import { createPinia } from 'pinia' 
import App from './App.vue'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

// Criar a instância do Pinia
const pinia = createPinia() // <-- 2. Crie a instância

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
  icons: {
    defaultSet: 'mdi',
  },
})

createApp(App)
  .use(vuetify)
  .use(pinia) // <-- 3. Diga ao App para usar o Pinia
  .mount('#app')
