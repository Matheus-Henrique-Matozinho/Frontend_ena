<template>
  <v-card variant="outlined" class="fill-height epi-card">
    <v-card-title>Análise de EPIs em Tempo Real</v-card-title>
    <v-card-text class="epi-container">
      <div v-for="epi in epiList" :key="epi.key" class="epi-item d-flex align-center">
        <!-- Coluna da Imagem -->
        <div class="image-container mr-4">
          <v-img
            :src="getImagePath(epi.key)"
            :alt="epi.name"
            class="epi-image"
            :class="{ 'epi-not-detected': !store.epiStatus[epi.key] }"
            width="64"
            height="64"
            contain
          ></v-img>
        </div>

        <!-- Coluna de Informação -->
        <div class="flex-grow-1">
          <div class="font-weight-bold">{{ epi.name }}</div>
          <div
            :class="store.epiStatus[epi.key] ? 'text-success' : 'text-error'"
            class="text-caption font-weight-bold"
          >
            {{ store.epiStatus[epi.key] ? 'DETECTADO' : 'NÃO DETECTADO' }}
          </div>
        </div>

        <!-- Indicador Visual -->
        <div class="status-indicator" :class="store.epiStatus[epi.key] ? 'bg-success' : 'bg-error'"></div>
      </div>
    </v-card-text>

    <!-- Ícone Vision Keeper no canto inferior direito -->
    <v-img
      src="/images/epi/logo_vision_keeper.png"
      alt="Vision Keeper"
      class="vision-logo"
      contain
      width="700"
      height="100"
    ></v-img>
  </v-card>
</template>

<script setup>
import { useMonitoringStore } from '@/stores/monitoring.js';

const store = useMonitoringStore();

// Lista de EPIs para facilitar a iteração no template
const epiList = [
  { key: 'capacete', name: 'Capacete de Segurança' },
  { key: 'oculos', name: 'Óculos de Proteção' },
  { key: 'luva', name: 'Luvas de Segurança' }
];

// Função dinâmica para obter o caminho da imagem com os nomes corretos
const getImagePath = (key) => {
  const isDetected = store.epiStatus[key];

  if (key === 'luva') {
    const color = isDetected ? 'verde' : 'vermelho';
    return `/images/epi/luvas_${color}.png`;
  }

  const color = isDetected ? 'verde' : 'vermelho';
  return `/images/epi/${key}_${color}.png`;
};
</script>

<style scoped>
.epi-container {
  display: flex;
  flex-direction: column;
  gap: 45px; /* Espaçamento entre os blocos */
}

.epi-item {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease-in-out;
}

.epi-image {
  transition: filter 0.3s ease-in-out;
}

.epi-not-detected {
  filter: grayscale(100%) opacity(60%);
}

.status-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  transition: background-color 0.3s ease-in-out;
}

/* Estilo do card para posicionar o logo */
.epi-card {
  position: relative;
}

/* Logo Vision Keeper no canto inferior direito */
.vision-logo {
  position: absolute;
  bottom: 8px;
  right: 8px;
  opacity: 0.8;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.vision-logo:hover {
  transform: scale(1.1);
  opacity: 1;
}
</style>
