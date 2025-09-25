<template>
  <div class="camera-feed">
    <h2 class="mb-2">Intelbras Camera Feed</h2>
    <div class="stream-container">
      <img
        v-if="!streamError"
        :src="cameraUrl"
        alt="Live Camera Feed"
        class="video-stream"
        @error="handleStreamError"
      />
      <div v-else class="error-placeholder d-flex flex-column align-center justify-center fill-height">
        <v-icon size="x-large" color="grey-lighten-1">mdi-video-off-outline</v-icon>
        <p class="mt-2 text-grey-lighten-1">Feed da câmera indisponível.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Mantendo a URL antiga por enquanto, conforme solicitado.
const cameraUrl = ref('http://admin:tcs1234!@192.168.18.169/cgi-bin/mjpg/video.cgi?channel=1&subtype=1');

const streamError = ref(false);

function handleStreamError() {
  console.error('Falha ao carregar o stream da câmera.');
  streamError.value = true;
}
</script>

<style scoped>
.camera-feed {
  text-align: center;
  width: 100%;
}
.stream-container {
  width: 100%;
  max-width: 800px; /* Limita a largura máxima */
  margin: 0 auto;
  background-color: #000;
  /* Proporção 16:9 para o vídeo */
  aspect-ratio: 16 / 9;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden; /* Garante que a imagem não vaze */
}
.video-stream {
  width: 100%;
  height: 100%;
  /* Garante que o vídeo cubra o container sem distorcer */
  object-fit: cover;
}
</style>