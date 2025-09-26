<template>
  <v-app>
    <!-- Barra Superior -->
    <v-app-bar app elevation="2" color="surface">
      <v-img src="/logo.png" max-height="50" max-width="50" contain class="ml-3 mr-4"></v-img>
      <v-app-bar-title class="font-weight-bold text-h6">
        KEEPER <span class="text-primary">IA</span>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-chip color="primary" variant="flat" class="mr-4">
        <v-icon start>mdi-robot-outline</v-icon>
        Demonstração ENA
      </v-chip>
    </v-app-bar>

    <!-- Painel Lateral -->
    <v-navigation-drawer
      v-model="drawerOpen"
      temporary
      width="400"
    >
      <v-card flat rounded="0" class="fill-height d-flex flex-column">
        <v-card-title class="d-flex align-center">
          <v-icon left class="mr-2">mdi-tune-variant</v-icon>
          Controle de Detecção
          <v-spacer></v-spacer>
          <v-btn icon variant="text" @click="drawerOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-subtitle>Selecione as classes para monitorar</v-card-subtitle>
        <v-divider class="mx-4 mb-2"></v-divider>

        <ClassSelector @classes-set="handleClassesSet" class="flex-grow-1" />
      </v-card>
    </v-navigation-drawer>

    <!-- Conteúdo Principal -->
    <v-main>
      <v-container fluid class="pa-md-6 pa-4 fill-height">
        <MonitoringView />
      </v-container>

      <!-- Botão Flutuante - estilo FAB -->
      <v-btn
        icon
        size="large"
        color="primary"
        class="fab-button"
        elevation="10"
        @click="drawerOpen = !drawerOpen"
      >
        <v-icon color="white">mdi-cog</v-icon>
        <v-tooltip activator="parent" location="top">
          Abrir Painel de Controle
        </v-tooltip>
      </v-btn>
    </v-main>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="4000"
      :color="snackbar.color"
      location="top right"
      variant="elevated"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn icon @click="snackbar.show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import MonitoringView from './components/MonitoringView.vue';
import ClassSelector from './components/ClassSelector.vue';

// Controle do drawer local
const drawerOpen = ref(false);

// Snackbar reativo
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
});

function showSnackbar(text, color = 'success') {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
}

function handleClassesSet() {
  drawerOpen.value = false;
  showSnackbar('Alteração de classes aplicada!');
}
</script>

<style scoped>
/* Botão flutuante estilo FAB */
.fab-button {
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
}

.fab-button:hover {
  background-color: #1976d2; /* Azul mais escuro no hover */
  transform: scale(1.05);
}
</style>
