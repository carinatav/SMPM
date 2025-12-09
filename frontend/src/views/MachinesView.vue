<template>
  <section class="space-y-6">
    <!-- Cabeçalho -->
    <header class="flex flex-col gap-1 mb-2">
      <p class="text-[11px] uppercase tracking-[0.25em] text-slate-400">
        Equipamentos
      </p>
      <h1 class="text-3xl font-semibold text-slate-900">Máquinas</h1>
      <p class="text-sm text-slate-500">
        Veja o status das máquinas e quantas manutenções estão abertas para cada uma.
      </p>
    </header>

    <!-- Estado de carregamento -->
    <div v-if="machineStore.loading || maintenanceStore.loading"
         class="text-sm text-slate-500">
      Carregando dados...
    </div>

    <!-- Sem nada -->
    <div v-else-if="!allMachines.length" class="text-sm text-slate-500">
      Nenhuma máquina encontrada. Cadastre uma manutenção para começar.
    </div>

    <!-- Grade de máquinas -->
    <div v-else class="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
      <h2 class="text-sm font-medium text-slate-800 mb-4">Máquinas cadastradas</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <article
          v-for="machine in allMachines"
          :key="machine.id"
          class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 flex flex-col gap-3"
        >
          <div>
            <p class="text-sm font-semibold text-slate-900">
              {{ machine.name }}
            </p>
            <p class="text-xs text-slate-500">
              Setor: {{ machine.sector || 'não informado' }}
            </p>
          </div>

          <button
            class="mt-1 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium
                   rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition"
            @click="goToMaintenanceList(machine.name)"
          >
            ver manutenções
          </button>

          <div class="flex items-center justify-between mt-1 text-xs">
            <span
              class="inline-flex items-center gap-1 px-2 py-1 rounded-full border"
              :class="statusClass(machine.status)"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-current" />
              <span>Status: {{ statusLabel(machine.status) }}</span>
            </span>

            <span
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="machine.openCount > 0
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-slate-100 text-slate-500 border border-slate-200'"
            >
              {{ machine.openCount }} abertas
            </span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMachineStore } from '../store/machine'
import { useMaintenanceStore } from '../store/maintenance'

const machineStore = useMachineStore()
const maintenanceStore = useMaintenanceStore()
const router = useRouter()

// junção: máquinas do backend + máquinas que aparecem nas manutenções
const allMachines = computed(() => {
  const base = (machineStore.machines || []).map((m) => ({
    id: m._id || m.id,
    name: m.name,
    sector: m.sector,
    status: m.status || 'operational',
  }))

  const fromMaint = (maintenanceStore.maintenances || []).reduce((acc, m) => {
    if (!m.machineName) return acc
    const key = (m.machineName || '').trim().toLowerCase()

    if (!acc[key]) {
      acc[key] = {
        id: m.machineName,
        name: m.machineName,
        sector: m.sector || '',
        status: 'operational',
        openCount: 0,
      }
    }

    // conta abertas
    if (m.status !== 'concluida') {
      acc[key].openCount = (acc[key].openCount || 0) + 1
      // se tiver alguma em andamento, status da máquina vira "maintenance"
      if (m.status === 'em_andamento') {
        acc[key].status = 'maintenance'
      }
    }

    return acc
  }, {})

  // mescla as duas fontes
  const merged = [...base]

  Object.values(fromMaint).forEach((m) => {
    const exists = merged.find(
      (b) => b.name.trim().toLowerCase() === m.name.trim().toLowerCase(),
    )
    if (exists) {
      // só soma as abertas vindas das manutenções
      exists.openCount = m.openCount || 0
      if (m.status === 'maintenance') exists.status = 'maintenance'
      if (!exists.sector) exists.sector = m.sector
    } else {
      merged.push(m)
    }
  })

  // garante openCount
  return merged.map((m) => ({
    ...m,
    openCount: m.openCount || 0,
  }))
})

function goToMaintenanceList(machineName) {
  router.push({
    name: 'maintenances',
    query: { machine: machineName },
  })
}

function statusLabel(status) {
  const map = {
    operational: 'Operacional',
    maintenance: 'Em manutenção',
    stopped: 'Parada',
  }
  return map[status] || 'Desconhecido'
}

function statusClass(status) {
  const map = {
    operational: 'border-emerald-200 text-emerald-700 bg-emerald-50',
    maintenance: 'border-amber-200 text-amber-700 bg-amber-50',
    stopped: 'border-rose-200 text-rose-700 bg-rose-50',
  }
  return map[status] || 'border-slate-200 text-slate-600 bg-slate-50'
}

onMounted(async () => {
  if (typeof machineStore.fetchMachines === 'function') {
    await machineStore.fetchMachines()
  }
  if (typeof maintenanceStore.fetchMaintenances === 'function') {
    await maintenanceStore.fetchMaintenances()
  }
})
</script>