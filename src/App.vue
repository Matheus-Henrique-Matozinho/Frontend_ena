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
        <v-row class="fill-height">
          <transition name="slide-fade" appear>
            <v-col cols="12" >
              <v-card class="fill-height d-flex flex-column mx-auto" max-width="95%">
                <v-card-title class="d-flex align-center">
                  <v-icon left class="mr-2">mdi-cctv</v-icon>
                  Câmera 01 - Acesso Principal
                  <v-chip size="small" color="green" class="ml-4 live-indicator">
                    <v-icon left size="small">mdi-record</v-icon>
                    AO VIVO
                  </v-chip>
                  <v-tooltip activator="parent" location="top">Feed de vídeo em tempo real</v-tooltip>
                  <v-spacer></v-spacer>
                  <div class="d-flex align-center">
                    <span class="text-caption mr-2">Atualizar Status</span>
                    <v-switch v-model="autoRefresh" color="primary" hide-details density="compact" class="flex-grow-0"></v-switch>
                  </div>
                </v-card-title>
                <v-divider class="mx-4"></v-divider>
                <v-card-text class="flex-grow-1 pa-0">
                  <div class="video-overlay-container">
                    <img 
                      src="http://localhost:8000/video_feed" 
                      alt="Live feed" 
                      class="video-stream"
                      @error="handleStreamError"
                    />
                    <div v-if="streamError" class="stream-error-overlay">
                        <v-alert type="error" prominent tile class="fill-height d-flex align-center justify-center">
                          <div class="text-center">
                            <v-icon size="x-large">mdi-video-off</v-icon>
                            <div class="mt-2">Não foi possível conectar ao stream da câmera.</div>
                          </div>
                        </v-alert>
                    </div>

                    <div class="status-bar-vuetify">
                      <div class="d-flex flex-column ga-2">
                        <v-chip :color="epiStatus.capacete ? 'success' : 'error'" variant="flat" elevation="4" class="interactive-chip">
                          <v-icon start>mdi-hard-hat</v-icon>
                          Capacete
                        </v-chip>
                        <v-chip :color="epiStatus.oculos ? 'success' : 'error'" variant="flat" elevation="4" class="interactive-chip">
                          <v-icon start>mdi-safety-goggles</v-icon>
                          Óculos
                        </v-chip>
                        <v-chip :color="epiStatus.luva ? 'success' : 'error'" variant="flat" elevation="4" class="interactive-chip">
                          <v-icon start>mdi-hand-front-right</v-icon>
                          Luva
                        </v-chip>
                      </div>
                      <v-chip class="mt-2 interactive-chip" prepend-icon="mdi-account-group" elevation="4">
                        Nº pessoas: {{ numPeople }}
                        <v-tooltip activator="parent" location="right">Pessoas detectadas</v-tooltip>
                      </v-chip>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </transition>
        </v-row>
      </v-container>

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
            <v-tooltip activator="parent" location="top">Configure os parâmetros</v-tooltip>
          </v-card-title>
          <v-card-subtitle>Selecione as classes para monitorar</v-card-subtitle>
          <v-divider class="mx-4 mb-2"></v-divider>
          
          <ClassSelector />

        </v-card>
      </v-navigation-drawer>
    </v-main>
  </v-app>
</template>

<script setup>
// O SCRIPT CONTINUA IGUAL AO ANTERIOR, SEM MUDANÇAS NECESSÁRIAS
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useTheme } from 'vuetify'
import ClassSelector from './components/ClassSelector.vue'

const theme = useTheme()
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const numPeople = ref(0)
const epiStatus = ref({
  capacete: false,
  oculos: false,
  luva: false,
})
const autoRefresh = ref(true) 
const streamError = ref(false) 
let intervalId = null
const isControlPanelOpen = ref(false)

async function fetchStatus() {
  try {
    const res = await fetch('http://localhost:8000/status')
    if (!res.ok) throw new Error('Network response was not ok')
    
    const data = await res.json()
    numPeople.value = data.person_count
    if (data.detected_epis) {
      epiStatus.value = data.detected_epis
    }
    streamError.value = false;
  } catch (err) {
    console.error('Falha ao buscar status:', err)
    streamError.value = true;
  }
}

function handleStreamError() {
  console.error("Erro fatal no stream de vídeo MJPEG.");
  streamError.value = true
}

function stopPolling() {
  if (intervalId) clearInterval(intervalId)
  intervalId = null
}

function startPolling() {
  stopPolling()
  if (autoRefresh.value) {
    fetchStatus()
    intervalId = setInterval(fetchStatus, 1500)
  }
}

watch(autoRefresh, (newValue) => {
  if (newValue) {
    startPolling()
  } else {
    stopPolling()
  }
}, { immediate: true })

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
/* O CSS CONTINUA IGUAL AO ANTERIOR, SEM MUDANÇAS NECESSÁRIAS */
.main-background {
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.02) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0.02) 75%, transparent 75%, transparent 100%);
  background-size: 40px 40px;
  transition: background-color 0.3s ease;
}

.slide-fade-enter-active {
  transition: all 0.6s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.interactive-chip {
  transition: all 0.2s ease-in-out;
  cursor: default;
}
.interactive-chip:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}
.live-indicator {
  animation: pulse 2s infinite;
}

.video-overlay-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #000;
}

.fill-height {
  height: 100%;
}

.status-bar-vuetify {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.video-stream {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stream-error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>