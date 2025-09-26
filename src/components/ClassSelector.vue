<template>
    <v-sheet class="pa-4 d-flex flex-column" height="100%">
        <h3 class="mb-4">Selecionar Classes</h3>

        <div v-if="loading" class="text-center mt-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4 text-medium-emphasis">Carregando classes...</p>
        </div>

        <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4">
          {{ error }}
        </v-alert>
        
        <v-list 
          v-else 
          v-model:selected="selected" 
          select-strategy="multiple"
          class="flex-grow-1"
          bg-color="transparent"
        >
            <v-list-item
                v-for="cls in availableClasses"
                :key="cls"
                :value="cls"
                class="mb-2"
                rounded="lg"
            >
                <template v-slot:prepend>
                  <v-icon :icon="getClassIcon(cls)" class="mr-3"></v-icon>
                </template>

                <v-list-item-title class="font-weight-medium text-capitalize">
                  {{ cls.replace('_', ' ') }}
                </v-list-item-title>

                <template v-slot:append="{ isSelected }">
                  <v-icon
                    v-if="isSelected"
                    color="primary"
                    icon="mdi-check-circle"
                  ></v-icon>
                </template>
                </v-list-item>
        </v-list>

        <v-btn 
          @click="submitSelection" 
          :loading="isSubmitting"
          :disabled="loading || !!error || isSubmitting" 
          color="primary" 
          block 
          class="mt-4"
          size="large"
        >
            Aplicar
        </v-btn>
    </v-sheet>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/services/api.js';
import { useMonitoringStore } from '@/stores/monitoring.js';

const store = useMonitoringStore();

const availableClasses = ref([]);
const selected = ref([]);
const loading = ref(true);
const error = ref(null);
const isSubmitting = ref(false);

const emit = defineEmits(['classes-set']);

function getClassIcon(className) {
  const icons = {
    capacete: 'mdi-hard-hat',
    oculos: 'mdi-sunglasses',
    luva: 'mdi-hand-back-right-outline',
    person: 'mdi-account',
  };
  return icons[className] || 'mdi-tag-outline';
}

async function fetchClasses() {
    try {
        loading.value = true;
        error.value = null;
        
        const [availableData, selectedData] = await Promise.all([
            api.getClasses(),
            api.getSelectedClasses()
        ]);

        availableClasses.value = availableData.available_classes || [];
        selected.value = selectedData.selected_classes || [];
        
    } catch (err) {
        console.error(err);
        error.value = 'Falha ao carregar dados das classes.';
    } finally {
        loading.value = false;
    }
}

async function submitSelection() {
    isSubmitting.value = true;
    error.value = null;
    try {
        await api.setClasses(selected.value);
        emit('classes-set');
        
        await store.fetchMonitoredClasses();

    } catch (err) {
        console.error('Failed to set target classes:', err);
        error.value = 'Falha ao aplicar as classes.';
    } finally {
        isSubmitting.value = false;
    }
}

onMounted(fetchClasses);
</script>

<style scoped>
.checkbox-group {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}
</style>