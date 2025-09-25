<template>
  <v-row class="fill-height">
    <transition name="slide-fade" appear>
      <v-col cols="12">
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
                :src="videoFeedUrl"
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { api } from '@/services/api.js'

// URL do stream de vídeo vinda do .env
const videoFeedUrl = `${import.meta.env.VITE_API_BASE_URL}/video_feed`;

const numPeople = ref(0)
const epiStatus = ref({
  capacete: false,
  oculos: false,
  luva: false,
})
const autoRefresh = ref(true) 
const streamError = ref(false) 
let intervalId = null

async function fetchStatus() {
  try {
    const data = await api.getStatus();
    
    numPeople.value = data.person_count;
    if (data.detected_epis) {
      epiStatus.value = data.detected_epis;
    }
    streamError.value = false;
  } catch (err) {
    console.error('Falha ao buscar status:', err);
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
/* Copie todos os estilos que estavam no App.vue para cá */
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