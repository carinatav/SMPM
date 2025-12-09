<template>
  <section class="space-y-6">
    <!-- Cabeçalho -->
    <header class="flex items-center justify-between">
      <div>
        <p class="text-[11px] uppercase tracking-[0.25em] text-slate-400">
          Agenda
        </p>
        <h1 class="text-2xl font-semibold text-slate-900">
          Calendário de manutenções
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Visualize as manutenções programadas por dia.
        </p>
      </div>

      <div class="hidden md:flex items-center gap-2 text-xs text-slate-500">
        <span class="w-2 h-2 rounded-full bg-indigo-500" />
        <span>{{ events.length }} eventos carregados</span>
      </div>
    </header>

    <!-- Card principal -->
    <div class="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
      <!-- Calendário -->
      <Calendar :events="events" @day-selected="handleDaySelected" />

      <!-- Painel de manutenções do dia -->
      <div class="mt-6 border-t border-slate-200 pt-4">
        <h2 class="text-sm font-medium text-slate-800 mb-3">
          Manutenções do dia
          <span v-if="selectedDate" class="text-slate-500 font-normal">
            — {{ selectedDate }}
          </span>
        </h2>

        <p v-if="!selectedDate" class="text-sm text-slate-500">
          Selecione um dia no calendário para ver as manutenções agendadas.
        </p>

        <p v-else-if="!selectedEvents.length" class="text-sm text-slate-500">
          Nenhuma manutenção agendada para este dia.
        </p>

        <ul v-else class="space-y-2 text-sm">
          <li
            v-for="m in selectedEvents"
            :key="m._id"
            class="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
          >
            <div class="flex flex-col">
              <span class="font-medium text-slate-900">
                {{ m.title }}
              </span>
              <span class="text-[11px] text-slate-500">
                {{ m.machineName }} · {{ m.sector }}
              </span>
            </div>

            <span :class="statusChipClass(m.status)">
              {{ statusLabel(m.status) }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import Calendar from '../components/Calendar.vue'
import { useMaintenanceStore } from '../store/maintenance'

const store = useMaintenanceStore()

// converte as manutenções em "events" pro calendário
const events = computed(() =>
  (store.maintenances || []).map((m) => ({
    ...m,
    _id: m._id || m.id,
    scheduledDate: m.scheduledDate || m.date || null,
  })),
)

const selectedDate = ref(null)
const selectedEvents = ref([])

function handleDaySelected(payload) {
  selectedDate.value = payload.date
  selectedEvents.value = payload.events || []
}

function statusLabel(status) {
  const map = {
    pendente: 'Pendente',
    em_andamento: 'Em andamento',
    concluida: 'Concluída',
  }
  return map[status] || status || '—'
}

function statusChipClass(status) {
  const base =
    'inline-flex items-center justify-center text-[11px] px-3 py-1 rounded-full border '
  if (status === 'concluida') return base + 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'em_andamento') return base + 'bg-sky-50 text-sky-700 border-sky-300'
  return base + 'bg-amber-50 text-amber-700 border-amber-200'
}

onMounted(async () => {
  if (typeof store.fetchMaintenances === 'function') {
    await store.fetchMaintenances()
  }
})
</script>