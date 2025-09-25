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
        
        <div v-else class="checkbox-group flex-grow-1">
            <v-checkbox
                v-for="cls in availableClasses"
                :key="cls"
                v-model="selected"
                :label="cls"
                :value="cls"
                density="compact"
                hide-details
            ></v-checkbox>
        </div>

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
import { ref, onMounted, defineEmits } from 'vue'
import { api } from '@/services/api.js'

const availableClasses = ref([])
const selected = ref([])
const loading = ref(true)
const error = ref(null)
const isSubmitting = ref(false) // <-- Para o estado de loading do botão

const emit = defineEmits(['classes-set']) // <-- Definimos o evento que será emitido

async function fetchClasses() {
    try {
        loading.value = true
        error.value = null
        
        const [availableData, selectedData] = await Promise.all([
            api.getClasses(),
            api.getSelectedClasses()
        ]);

        availableClasses.value = availableData.available_classes || []
        // LÓGICA CORRIGIDA: Usa os dados do backend para o valor inicial
        selected.value = selectedData.selected_classes || [] 
        
    } catch (err) {
        console.error(err)
        error.value = 'Falha ao carregar dados das classes.'
    } finally {
        loading.value = false
    }
}

async function submitSelection() {
    isSubmitting.value = true
    error.value = null
    try {
        const data = await api.setClasses(selected.value)
        console.log('Target classes set:', data)
        emit('classes-set') // <-- EMITIR EVENTO EM CASO DE SUCESSO
    } catch (err) {
        console.error('Failed to set target classes:', err)
        error.value = 'Falha ao aplicar as classes.'
    } finally {
        isSubmitting.value = false
    }
}

onMounted(fetchClasses)
</script>

<style scoped>
.checkbox-group {
    display: flex;
    flex-direction: column;
    overflow-y: auto; /* Adiciona scroll se a lista for muito grande */
}
</style>