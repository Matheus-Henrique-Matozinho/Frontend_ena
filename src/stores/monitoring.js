import { defineStore } from 'pinia';
import { api } from '@/services/api.js';

export const useMonitoringStore = defineStore('monitoring', {
  state: () => ({
    numPeople: 0,
    epiStatus: {
      capacete: false,
      oculos: false,
      luva: false,
    },
    streamError: false,
    isLoading: true,
    lastErrorMessage: null,
    // NOVO: O estado do painel agora vive aqui
    isControlPanelOpen: false, 
  }),

  actions: {
    // NOVO: Ação para abrir/fechar o painel
    toggleControlPanel() {
      this.isControlPanelOpen = !this.isControlPanelOpen;
    },

    async fetchStatus() {
      try {
        const data = await api.getStatus();
        this.numPeople = data.person_count;
        if (data.detected_epis) {
          this.epiStatus = data.detected_epis;
        }
        this.streamError = false;
        this.lastErrorMessage = null;
      } catch (err) {
        console.error('Falha ao buscar status:', err);
        this.streamError = true;
        this.lastErrorMessage = err.message || 'Falha ao buscar status.';
      } finally {
        if (this.isLoading) {
          this.isLoading = false;
        }
      }
    },

    startPolling() {
      this.stopPolling();
      // O polling agora é incondicional, já que removemos o switch
      this.fetchStatus();
      this.intervalId = setInterval(() => this.fetchStatus(), 1500);
    },

    stopPolling() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      this.intervalId = null;
    },

    handleStreamError() {
      this.streamError = true;
      console.error("Erro fatal no stream de vídeo MJPEG.");
    },
  },
});

