// src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Uma função helper para tratar a resposta do fetch.
 * Ela verifica se a resposta foi bem-sucedida e já converte para JSON.
 * @param {Response} response A resposta do fetch.
 * @returns {Promise<any>} O corpo da resposta em JSON.
 */
async function handleResponse(response) {
  if (!response.ok) {
    // Tenta extrair uma mensagem de erro do corpo da resposta da API
    const errorBody = await response.json().catch(() => ({ message: 'Erro HTTP desconhecido' }));
    // Lança um erro com a mensagem do backend ou uma mensagem padrão
    throw new Error(errorBody.message || `Erro ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// Exportamos um objeto com todas as funções da nossa API
export const api = {
  /** Busca o status geral (pessoas e EPIs) */
  getStatus: () => {
    return fetch(`${API_BASE_URL}/status`).then(handleResponse);
  },

  /** Busca a lista de todas as classes disponíveis */
  getClasses: () => {
    return fetch(`${API_BASE_URL}/get_classes`).then(handleResponse);
  },

  /** Busca a lista de classes atualmente selecionadas */
  getSelectedClasses: () => {
    return fetch(`${API_BASE_URL}/get_selected_classes`).then(handleResponse);
  },

  /** Define quais classes devem ser monitoradas */
  setClasses: (classes) => {
    return fetch(`${API_BASE_URL}/set_classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classes }),
    }).then(handleResponse);
  }
};
