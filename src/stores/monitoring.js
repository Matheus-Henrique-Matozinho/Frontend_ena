import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { api } from '@/services/api.js';

// 'monitoring' é o ID único deste store.
export const useMonitoringStore = defineStore('monitoring', () => {
  // ------------------- STATE -------------------
  const isLoading = ref(true); // <-- NOVO ESTADO: para o carregamento inicial
  const numPeople = ref(0);
  const epiStatus = ref({
    capacete: false,
    oculos: false,
    luva: false,
  });
  const streamError = ref(false);
  const autoRefresh = ref(true);

  let intervalId = null;

  // ------------------- ACTIONS -------------------
  async function fetchStatus() {
    try {
      const data = await api.getStatus();
      numPeople.value = data.person_count;
      if (data.detected_epis) {
        epiStatus.value = data.detected_epis;
      }
      if (streamError.value) {
        streamError.value = false;
      }
    } catch (err) {
      console.error('Falha ao buscar status:', err);
      streamError.value = true;
    } finally {
      // Ao final da primeira busca, desativamos o carregamento
      if (isLoading.value) {
        isLoading.value = false;
      }
    }
  }

  function handleStreamError() {
    console.error("Erro fatal no stream de vídeo MJPEG.");
    streamError.value = true;
  }

  function stopPolling() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function startPolling() {
    stopPolling();
    if (autoRefresh.value) {
      fetchStatus();
      intervalId = setInterval(fetchStatus, 1500);
    }
  }
  
  // ------------------- WATCHERS -------------------
  watch(autoRefresh, (newValue) => {
    if (newValue) {
      startPolling();
    } else {
      stopPolling();
    }
  });

  // Retornamos o novo estado para ser acessível
  return {
    isLoading, // <-- EXPORTAR O NOVO ESTADO
    numPeople,
    epiStatus,
    streamError,
    autoRefresh,
    handleStreamError,
    startPolling,
    stopPolling,
  };
});
