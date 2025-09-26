<template>
  <v-row class="fill-height">
    <!-- Coluna Esquerda: Feed de Vídeo (AGORA MAIOR) -->
    <v-col cols="12" md="9" class="d-flex flex-column">
      <v-card class="fill-height d-flex flex-column" variant="outlined">
        <v-card-title class="d-flex align-center">
          <v-icon left class="mr-2" color="primary">mdi-cctv</v-icon>
          <span>Feed da Câmara - Acesso Principal</span>
          <v-spacer></v-spacer>
          <v-chip size="small" color="success" variant="flat" class="live-indicator">
            <v-icon left size="small">mdi-record</v-icon>
            AO VIVO
          </v-chip>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="flex-grow-1 pa-0 video-card-text" style="min-height: 0;">
          <div class="video-overlay-container" style="position: absolute; top: 0; left: 0;">
            <img 
              :src="videoFeedUrl"
              alt="Live feed" 
              class="video-stream"
              @error="store.handleStreamError"
            />
            <div v-if="store.streamError" class="stream-error-overlay">
              <v-alert type="error" prominent tile class="fill-height d-flex align-center justify-center">
                <div class="text-center">
                  <v-icon size="x-large">mdi-video-off</v-icon>
                  <div class="mt-2">Não foi possível conectar ao stream da câmara.</div>
                </div>
              </v-alert>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Coluna Direita: Painel de Controlo e Status (AGORA MENOR) -->
    <v-col cols="12" md="3" class="d-flex flex-column">
      <!-- Card: Pessoas Detectadas -->
      <v-card variant="tonal" class="mb-4">
        <div class="d-flex align-center pa-4">
          <v-icon size="x-large" class="mr-4">mdi-account-group-outline</v-icon>
          <div>
            <div class="text-caption text-medium-emphasis">Pessoas Detectadas</div>
            <div class="text-h4 font-weight-bold">{{ store.numPeople }}</div>
          </div>
        </div>
      </v-card>

      <!-- NOVO COMPONENTE DE STATUS DE EPIs -->
      <EpiStatusPanel class="flex-grow-1" />
      
    </v-col>
  </v-row>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useMonitoringStore } from '@/stores/monitoring.js';
import EpiStatusPanel from './EpiStatusPanel.vue';

const store = useMonitoringStore();
const videoFeedUrl = `${import.meta.env.VITE_API_BASE_URL}/video_feed`;

onMounted(() => store.startPolling());
onUnmounted(() => store.stopPolling());
</script>

<style scoped>
.video-card-text {
  position: relative;
}
.video-overlay-container, .video-stream, .stream-error-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.video-stream {
  object-fit: cover;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}
.live-indicator {
  animation: pulse 2s infinite;
}
</style>

