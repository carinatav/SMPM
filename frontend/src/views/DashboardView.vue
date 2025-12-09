<template>
  <section class="space-y-6">
    <!-- Cabeçalho -->
    <header class="flex flex-col gap-1.5 mb-2">
      <p class="text-[11px] uppercase tracking-[0.25em] text-slate-500">
        Visão geral
      </p>

      <h1 class="text-3xl font-semibold text-slate-900">
        Dashboard
      </h1>

      <p class="text-sm text-slate-600">
        Acompanhe o status das manutenções em tempo real.
      </p>
    </header>

    <!-- Loading -->
    <div v-if="store.loading" class="text-sm text-slate-600">
      Carregando dados...
    </div>

    <!-- KPIs -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <KpiCard
        label="Manutenções atrasadas"
        :value="atrasadas"
        variant="danger"
      />
      <KpiCard
        label="Pendentes"
        :value="kpi.pendentes"
        variant="warning"
      />
      <KpiCard
        label="Concluídas"
        :value="kpi.concluidas"
        variant="success"
      />
    </div>

    <!-- Barras + próximas -->
    <div class="grid grid-cols-1 lg:grid-cols-[2fr_1.3fr] gap-4">
      <!-- Distribuição -->
      <div
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.04)]"
      >
        <h2 class="font-medium text-slate-900 text-sm mb-3">
          Distribuição de status
        </h2>

        <div class="space-y-3 text-xs text-slate-700">
          <DashboardBar
            label="Concluídas"
            color="bg-emerald-400"
            :value="kpi.concluidas"
            :total="kpi.total"
          />
          <DashboardBar
            label="Pendentes"
            color="bg-amber-400"
            :value="kpi.pendentes"
            :total="kpi.total"
          />
          <DashboardBar
            label="Em andamento"
            color="bg-sky-400"
            :value="kpi.emAndamento"
            :total="kpi.total"
          />
        </div>
      </div>

      <!-- Próximas -->
      <div
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.04)]"
      >
        <h2 class="font-medium text-slate-900 text-sm mb-3">
          Próximas manutenções
        </h2>

        <ul class="space-y-2">
          <li
            v-for="m in proximas"
            :key="m._id"
            class="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl"
          >
            <div class="flex flex-col">
              <p class="text-slate-900 text-sm font-medium">
                {{ m.title }}
              </p>
              <p class="text-[11px] text-slate-500">
                {{ m.machineName }} · {{ m.sector }}
              </p>
            </div>

            <span
              class="text-xs px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200"
            >
              {{ m.scheduledDate }}
            </span>
          </li>

          <li
            v-if="!proximas.length"
            class="text-sm text-slate-600"
          >
            Nenhuma manutenção futura cadastrada.
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMaintenanceStore } from '../store/maintenance'
import KpiCard from '../components/KpiCard.vue'
import DashboardBar from '../components/DashboardBar.vue'

const store = useMaintenanceStore()

const maintenances = computed(() => store.maintenances || [])

const kpi = computed(() => {
  const list = maintenances.value
  return {
    total: list.length,
    pendentes: list.filter((m) => m.status === 'pendente').length,
    emAndamento: list.filter((m) => m.status === 'em_andamento').length,
    concluidas: list.filter((m) => m.status === 'concluida').length,
  }
})

const atrasadas = computed(() => {
  const hoje = new Date().toISOString().slice(0, 10)
  return maintenances.value.filter(
    (m) => m.status !== 'concluida' && m.scheduledDate < hoje,
  ).length
})

const proximas = computed(() =>
  maintenances.value
    .filter((m) => m.status !== 'concluida')
    .sort((a, b) =>
      (a.scheduledDate || '').localeCompare(b.scheduledDate || ''),
    )
    .slice(0, 5),
)

onMounted(() => store.fetchMaintenances())
</script>

<style scoped>
/* Espaçamento e legibilidade já estão ajustados via Tailwind.
   Se quiser, depois podemos animar barras/cartões aqui. */
</style>