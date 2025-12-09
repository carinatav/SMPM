<template>
  <section class="space-y-6">
    <!-- link voltar -->
    <button
      class="text-xs text-indigo-500 hover:text-indigo-600 inline-flex items-center gap-1"
      @click="goBack"
    >
      ← voltar
    </button>

    <!-- Cabeçalho -->
    <header class="flex flex-col gap-1">
      <p class="text-[11px] uppercase tracking-[0.25em] text-slate-400">
        Detalhes
      </p>
      <h1 class="text-2xl md:text-3xl font-semibold text-slate-900">
        Detalhes da manutenção
      </h1>
      <p class="text-sm text-slate-500">
        Informações completas da atividade selecionada.
      </p>
    </header>

    <!-- loading -->
    <div v-if="!maintenance" class="text-sm text-slate-500">
      Carregando dados da manutenção...
    </div>

    <!-- conteúdo -->
    <div
      v-else
      class="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 md:p-7 space-y-5"
    >
      <!-- título + status -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 class="text-lg md:text-xl font-semibold text-slate-900">
            {{ maintenance.title || 'Manutenção' }}
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            Criada em {{ formatDate(maintenance.createdAt) }}
          </p>
        </div>

        <span
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border"
          :class="statusClass(maintenance.status)"
        >
          <span class="w-2 h-2 rounded-full" :class="dotClass(maintenance.status)" />
          <span>{{ statusLabel(maintenance.status) }}</span>
        </span>
      </div>

      <!-- grid de informações -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-sm text-slate-700">
        <p>
          <span class="font-semibold text-slate-900">Máquina:</span>
          {{ maintenance.machineName || '—' }}
        </p>
        <p>
          <span class="font-semibold text-slate-900">Setor:</span>
          {{ maintenance.sector || '—' }}
        </p>

        <p>
          <span class="font-semibold text-slate-900">Status:</span>
          {{ statusLabel(maintenance.status) }}
        </p>
        <p>
          <span class="font-semibold text-slate-900">Prioridade:</span>
          {{ maintenance.priority || '—' }}
        </p>

        <p>
          <span class="font-semibold text-slate-900">Técnico:</span>
          {{ maintenance.technician || '—' }}
        </p>
        <p>
          <span class="font-semibold text-slate-900">Tipo:</span>
          {{ maintenance.type || '—' }}
        </p>

        <p>
          <span class="font-semibold text-slate-900">Agendada:</span>
          {{ maintenance.scheduledDate || '—' }}
        </p>
      </div>

      <!-- descrição -->
      <div v-if="maintenance.description" class="pt-2 border-t border-slate-100">
        <p class="text-xs font-semibold text-slate-500 mb-1.5">
          Descrição
        </p>
        <p class="text-sm text-slate-700">
          {{ maintenance.description }}
        </p>
      </div>

      <!-- ações -->
      <div class="pt-3 flex flex-wrap gap-2">
        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-medium
                 bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="loadingAction || maintenance.status === 'em_andamento' || maintenance.status === 'concluida'"
          @click="setStatus('em_andamento')"
        >
          Marcar como em andamento
        </button>

        <button
          type="button"
          class="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-medium
                 bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="loadingAction || maintenance.status === 'concluida'"
          @click="setStatus('concluida')"
        >
          Finalizar manutenção
        </button>

        <p v-if="error" class="text-xs text-rose-500 mt-1">
          {{ error }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMaintenanceStore } from '../store/maintenance'

const route = useRoute()
const router = useRouter()
const store = useMaintenanceStore()

const id = computed(() => route.params.id)
const loadingAction = ref(false)
const error = ref('')

const maintenance = computed(() =>
  (store.maintenances || []).find(
    (m) => (m._id || m.id) === id.value
  )
)

onMounted(async () => {
  if (!maintenance.value && typeof store.fetchMaintenances === 'function') {
    await store.fetchMaintenances()
  }
})

function formatDate (value) {
  if (!value) return '—'
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleDateString('pt-BR')
  } catch {
    return value
  }
}

function statusLabel (status) {
  const map = {
    pendente: 'Pendente',
    em_andamento: 'Em andamento',
    concluida: 'Concluída'
  }
  return map[status] || status || '—'
}

function statusClass (status) {
  const base =
    'bg-slate-50 border-slate-200 text-slate-700'
  const map = {
    pendente:
      'bg-amber-50 border-amber-200 text-amber-700',
    em_andamento:
      'bg-sky-50 border-sky-200 text-sky-700',
    concluida:
      'bg-emerald-50 border-emerald-200 text-emerald-700'
  }
  return map[status] || base
}

function dotClass (status) {
  const base = 'bg-slate-400'
  const map = {
    pendente: 'bg-amber-500',
    em_andamento: 'bg-sky-500',
    concluida: 'bg-emerald-500'
  }
  return map[status] || base
}

async function setStatus (newStatus) {
  try {
    loadingAction.value = true
    error.value = ''
    // usa updateStatus se existir, senão updateMaintenance
    if (typeof store.updateStatus === 'function') {
      await store.updateStatus(id.value, newStatus)
    } else if (typeof store.updateMaintenance === 'function') {
      await store.updateMaintenance(id.value, { status: newStatus })
    }
  } catch (e) {
    console.error(e)
    error.value = 'Não foi possível atualizar o status.'
  } finally {
    loadingAction.value = false
  }
}

function goBack () {
  if (window.history.length > 1) router.back()
  else router.push({ name: 'maintenances' })
}
</script>