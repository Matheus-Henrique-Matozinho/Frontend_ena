<template>
  <v-app>
    <v-app-bar app elevation="2" color="indigo-darken-3">
      <v-img src="/logo.png" max-height="55" max-width="55" contain class="ml-2 mr-4"></v-img>
      <v-app-bar-title>Painel de Monitoramento IA</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleTheme">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      <v-tooltip activator="parent" location="bottom">Alternar Tema</v-tooltip>
    </v-app-bar>

    <v-main class="main-background">
      <v-container fluid class="pa-4 fill-height">
        <!-- O conteúdo principal agora é delegado para este componente -->
        <MonitoringView />
      </v-container>

      <!-- O botão e o painel lateral são parte do layout principal -->
      <v-btn
        icon="mdi-tune-variant"
        position="fixed"
        location="bottom right"
        size="large"
        color="primary"
        elevation="8"
        class="ma-4"
        @click="isControlPanelOpen = !isControlPanelOpen"
      >
        <v-icon color="white">mdi-cog</v-icon>
        <v-tooltip activator="parent" location="top">
          Abrir Controle de Detecção
        </v-tooltip>
      </v-btn>

      <v-navigation-drawer
        v-model="isControlPanelOpen"
        location="right"
        temporary
        width="400"
      >
        <v-card flat rounded="0" class="fill-height">
          <v-card-title>
            <v-icon left class="mr-2">mdi-tune-variant</v-icon>
            Controle de Detecção
          </v-card-title>
          <v-card-subtitle>Selecione as classes para monitorar</v-card-subtitle>
          <v-divider class="mx-4 mb-2"></v-divider>
          
          <!-- O componente filho emite o evento 'classes-set' que chama a nossa função -->
          <ClassSelector @classes-set="handleClassesSet" />
        </v-card>
      </v-navigation-drawer>
    </v-main>

    <!-- Snackbar para exibir notificações globais -->
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      :color="snackbarColor"
      location="top right"
      variant="elevated"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import ClassSelector from './components/ClassSelector.vue'
import MonitoringView from './components/MonitoringView.vue'

const theme = useTheme()
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

// Estado do painel lateral
const isControlPanelOpen = ref(false)

// --- LÓGICA DO SNACKBAR ---
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

/**
 * Mostra uma notificação na tela.
 * @param {string} text - A mensagem a ser exibida.
 * @param {string} [color='success'] - A cor do snackbar ('success', 'error', 'info', etc.).
 */
function showSnackbar(text, color = 'success') {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}
// --- FIM DA LÓGICA DO SNACKBAR ---

/**
 * Função chamada quando as classes são aplicadas com sucesso.
 * Fecha o painel e exibe uma notificação.
 */
function handleClassesSet() {
  isControlPanelOpen.value = false
  showSnackbar('Mudança de classes aplicada!')
}
</script>

<style scoped>
/* O único estilo necessário no App.vue é o do background */
.main-background {
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.02) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0.02) 75%, transparent 75%, transparent 100%);
  background-size: 40px 40px;
  transition: background-color 0.3s ease;
}
</style>