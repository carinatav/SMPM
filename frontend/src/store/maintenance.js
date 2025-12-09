// src/store/maintenance.js
import { defineStore } from 'pinia'
import api from '../services/api'

export const useMaintenanceStore = defineStore('maintenance', {
  state: () => ({
    maintenances: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchMaintenances() {
      try {
        this.loading = true
        const res = await api.get('/maintenances')
        this.maintenances = res.data
      } catch (err) {
        console.error("Erro ao carregar manutenções:", err)
        this.error = 'Não foi possível carregar as manutenções.'
      } finally {
        this.loading = false
      }
    },

    async createMaintenance(data) {
      try {
        await api.post('/maintenances', data)
        await this.fetchMaintenances() // atualiza todas as telas
      } catch (err) {
        console.error("Erro ao criar manutenção:", err)
      }
    },

    async deleteMaintenance(id) {
      try {
        await api.delete(`/maintenances/${id}`)
        await this.fetchMaintenances()
      } catch (err) {
        console.error("Erro ao excluir manutenção:", err)
      }
    },

    async updateMaintenance(id, data) {
      try {
        await api.put(`/maintenances/${id}`, data)
        await this.fetchMaintenances()
      } catch (err) {
        console.error("Erro ao atualizar manutenção:", err)
      }
    },

    async updateStatus(id, newStatus) {
      try {
        const res = await api.patch(`/maintenances/${id}`, { status: newStatus })

        // atualiza localmente sem recarregar tudo
        const index = this.maintenances.findIndex(m => m._id === id)
        if (index !== -1) {
          this.maintenances[index] = res.data
        } else {
          // fallback, caso não tenha encontrado localmente
          await this.fetchMaintenances()
        }

        return res.data
      } catch (err) {
        console.error("Erro ao mudar status:", err)
      }
    }
  }
})