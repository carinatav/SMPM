import { defineStore } from 'pinia'
import api from '../services/api'

export const useMachineStore = defineStore('machine', {
  state: () => ({
    machines: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMachines() {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/machines')
        this.machines = data
      } catch (err) {
        console.error(err)
        this.error = 'Erro ao carregar máquinas'
      } finally {
        this.loading = false
      }
    },
  },
})