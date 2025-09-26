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
    // NOVO ESTADO: Armazena as classes que devem ser exibidas no painel
    monitoredClasses: [],
    streamError: false,
    isLoading: true,
    lastErrorMessage: null,
    isControlPanelOpen: false, 
  }),

  actions: {
    toggleControlPanel() {
      this.isControlPanelOpen = !this.isControlPanelOpen;
    },

    // NOVA AÇÃO: Busca e atualiza as classes selecionadas no backend
    async fetchMonitoredClasses() {
      try {
      const data = await api.getSelectedClasses();

      // LOG 2: O que a API nos diz que são as classes monitoradas?
      console.log('[Store] Dados recebidos de getSelectedClasses:', data);

      this.monitoredClasses = data.selected_classes || [];
    } catch (err) {
      console.error('Falha ao buscar classes monitoradas:', err);
    }
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