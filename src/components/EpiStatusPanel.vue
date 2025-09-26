<template>
  <v-card variant="outlined" class="fill-height epi-card">
    <v-card-title>Análise de EPIs em Tempo Real</v-card-title>
    <v-card-text class="epi-container">
      <div v-for="epi in monitoredEpiList" :key="epi.key" class="epi-item d-flex align-center">
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
        <div class="flex-grow-1">
          <div class="font-weight-bold">{{ epi.name }}</div>
          <div
            :class="store.epiStatus[epi.key] ? 'text-success' : 'text-error'"
            class="text-caption font-weight-bold"
          >
            {{ store.epiStatus[epi.key] ? 'DETECTADO' : 'NÃO DETECTADO' }}
          </div>
        </div>
        <div class="status-indicator" :class="store.epiStatus[epi.key] ? 'bg-success' : 'bg-error'"></div>
      </div>

      <div v-if="monitoredEpiList.length === 0" class="text-center text-medium-emphasis pa-4">
        <v-icon size="large">mdi-checkbox-multiple-blank-outline</v-icon>
        <p class="mt-2 text-caption">Nenhum EPI selecionado para monitoramento.</p>
      </div>

    </v-card-text>

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
import { computed } from 'vue'; // Importar 'computed'
import { useMonitoringStore } from '@/stores/monitoring.js';

const store = useMonitoringStore();

// Um mapa com as informações de todos os EPIs possíveis
const ALL_EPIS = {
  capacete: { name: 'Capacete de Segurança' },
  oculos: { name: 'Óculos de Proteção' },
  luva: { name: 'Luvas de Segurança' }
};

// CRIAR uma propriedade computada que filtra os EPIs com base na store
const monitoredEpiList = computed(() => {
  const result = store.monitoredClasses
    .filter(key => ALL_EPIS[key])
    .map(key => ({
      key: key,
      name: ALL_EPIS[key].name
    }));

  // LOG 3: Qual é a lista final que o componente vai renderizar?
  console.log('[EpiStatusPanel] Lista de EPIs a ser renderizada:', result);

  return result;
});

// A função 'getImagePath' continua a mesma
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
  gap: 45px;
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
.epi-card {
  position: relative;
}
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