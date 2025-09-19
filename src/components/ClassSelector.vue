<template>
    <v-sheet class="pa-4" height="100%">
        <h3 class="mb-4">Selecionar Classes</h3>

        <div v-if="loading" class="text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p>Carregando classes...</p>
        </div>
        <v-alert v-else-if="error" type="error" dense>{{ error }}</v-alert>
        
        <div v-else class="checkbox-group">
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

        <v-spacer></v-spacer>
        
        <v-btn @click="submitSelection" :disabled="loading || !!error" color="primary" block class="mt-4">
            Aplicar Classes
        </v-btn>
    </v-sheet>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'

const availableClasses = ref([])
const selected = ref([])
const loading = ref(true)
const error = ref(null)

const emit = defineEmits(['classes-set'])

async function fetchClasses() {
    try {
        loading.value = true
        // Limpamos o erro anterior
        error.value = null;
        const [availableRes, selectedRes] = await Promise.all([
            fetch('http://localhost:8000/get_classes'),
            fetch('http://localhost:8000/get_selected_classes')
        ])

        if (!availableRes.ok || !selectedRes.ok) throw new Error('Failed to fetch class data')

        const availableData = await availableRes.json()
        availableClasses.value = availableData.available_classes || []
        
        // Define todas as classes como selecionadas por padrão
        selected.value = [...availableClasses.value]
        
    } catch (err) {
        console.error(err)
        error.value = 'Falha ao carregar dados das classes.'
    } finally {
        loading.value = false
    }
}

async function submitSelection() {
    try {
        const response = await fetch('http://localhost:8000/set_classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classes: selected.value })
        })
        if (!response.ok) throw new Error('Server responded with an error');
        const data = await response.json()
        console.log('Target classes set:', data)
        // Emite o evento para fechar o painel de configurações
        emit('classes-set')
    } catch (err) {
        console.error('Failed to set target classes:', err)
        error.value = 'Falha ao aplicar as classes.'
    }
}

onMounted(fetchClasses)
</script>

<style scoped>
/* A maior parte do CSS antigo não é mais necessária! */
.checkbox-group {
    display: flex;
    flex-direction: column;
}
</style>