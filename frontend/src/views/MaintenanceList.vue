<template>
  <section class="space-y-6">
    <!-- Cabeçalho -->
    <header class="flex flex-col gap-2 mb-2">
      <p class="text-[11px] uppercase tracking-[0.25em] text-slate-400">
        Lista
      </p>

      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-3xl font-semibold text-slate-900">Manutenções</h1>
          <p class="text-sm text-slate-500 mt-1">
            Filtre, visualize, edite ou exclua as manutenções cadastradas.
          </p>
        </div>

        <button
          class="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium
                 bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm"
          @click="openNew"
        >
          + Nova manutenção
        </button>
      </div>
    </header>

    <!-- Card de filtros -->
    <div
      class="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm space-y-4"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-medium text-slate-800">Filtros</h2>
        <button
          class="text-xs text-slate-500 hover:text-slate-700"
          @click="clearFilters"
        >
          Limpar filtros
        </button>
      </div>

      <div class="grid gap-3 md:grid-cols-5">
        <input
          v-model="filters.machine"
          type="text"
          placeholder="Máquina"
          class="input-filter"
        />
        <input
          v-model="filters.sector"
          type="text"
          placeholder="Setor"
          class="input-filter"
        />
        <select
          v-model="filters.status"
          class="input-filter"
        >
          <option value="">Status (todos)</option>
          <option value="pendente">Pendente</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluida">Concluída</option>
        </select>
        <input
          v-model="filters.from"
          type="date"
          class="input-filter"
        />
        <input
          v-model="filters.to"
          type="date"
          class="input-filter"
        />
      </div>
    </div>

    <!-- Lista / tabela -->
    <div class="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
      <div v-if="store.loading" class="text-sm text-slate-500">
        Carregando manutenções...
      </div>

      <div
        v-else-if="!filteredMaintenances.length"
        class="text-sm text-slate-500 text-center py-6"
      >
        Nenhuma manutenção encontrada com os filtros atuais.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-left text-xs text-slate-500 border-b border-slate-200">
              <th class="py-2 pr-4">Título</th>
              <th class="py-2 pr-4">Máquina</th>
              <th class="py-2 pr-4">Setor</th>
              <th class="py-2 pr-4">Tipo</th>
              <th class="py-2 pr-4">Prioridade</th>
              <th class="py-2 pr-4">Status</th>
              <th class="py-2 pr-4">Agendada</th>
              <th class="py-2 pr-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="m in filteredMaintenances"
              :key="m._id"
              class="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
            >
              <td class="py-2 pr-4 text-slate-900 font-medium">
                {{ m.title || 'Sem título' }}
              </td>
              <td class="py-2 pr-4 text-slate-700">
                {{ m.machineName || '—' }}
              </td>
              <td class="py-2 pr-4 text-slate-700">
                {{ m.sector || '—' }}
              </td>
              <td class="py-2 pr-4 text-slate-700 capitalize">
                {{ m.type || '—' }}
              </td>
              <td class="py-2 pr-4 text-slate-700 capitalize">
                {{ m.priority || '—' }}
              </td>
              <td class="py-2 pr-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium"
                  :class="statusPillClass(m.status)"
                >
                  {{ statusLabel(m.status) }}
                </span>
              </td>
              <td class="py-2 pr-4 text-slate-700">
                {{ m.scheduledDate || '—' }}
              </td>
              <td class="py-2 pr-4">
                <div class="flex items-center justify-end gap-2 text-xs">
                  <button
                    class="px-2 py-1 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100"
                    @click="goToDetails(m)"
                  >
                    Ver
                  </button>
                  <button
                    class="px-2 py-1 rounded-full border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    @click="openEdit(m)"
                  >
                    Editar
                  </button>
                  <button
                    class="px-2 py-1 rounded-full border border-rose-200 text-rose-700 hover:bg-rose-50"
                    @click="remove(m)"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal simples de cadastro/edição -->
    <div
      v-if="showForm"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black/30"
    >
      <div
        class="w-full max-w-lg bg-white rounded-2xl shadow-xl p-5 md:p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-slate-900">
            {{ editing ? 'Editar manutenção' : 'Nova manutenção' }}
          </h2>
          <button
            class="text-slate-400 hover:text-slate-600"
            @click="closeForm"
          >
            ✕
          </button>
        </div>

        <form class="space-y-3" @submit.prevent="submitForm">
          <div class="grid md:grid-cols-2 gap-3">
            <input v-model="form.title" class="input-form" placeholder="Título" />
            <input v-model="form.machineName" class="input-form" placeholder="Máquina" />
          </div>

          <div class="grid md:grid-cols-2 gap-3">
            <input v-model="form.sector" class="input-form" placeholder="Setor" />
            <input v-model="form.technician" class="input-form" placeholder="Técnico" />
          </div>

          <div class="grid md:grid-cols-3 gap-3">
            <select v-model="form.type" class="input-form">
              <option value="preventiva">Preventiva</option>
              <option value="corretiva">Corretiva</option>
            </select>

            <select v-model="form.priority" class="input-form">
              <option value="baixa">Baixa</option>
              <option value="média">Média</option>
              <option value="alta">Alta</option>
            </select>

            <select v-model="form.status" class="input-form">
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>

          <input
            v-model="form.scheduledDate"
            type="date"
            class="input-form"
          />

          <textarea
            v-model="form.description"
            rows="3"
            class="input-form resize-none"
            placeholder="Descrição (opcional)"
          />

          <div class="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              class="px-3 py-1.5 rounded-full text-xs text-slate-600 hover:bg-slate-100"
              @click="closeForm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 rounded-full text-xs font-medium bg-indigo-500 text-white hover:bg-indigo-600"
            >
              {{ editing ? 'Salvar alterações' : 'Cadastrar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMaintenanceStore } from '../store/maintenance'

const store = useMaintenanceStore()
const router = useRouter()

// ------- Filtros -------
const filters = reactive({
  machine: '',
  sector: '',
  status: '',
  from: '',
  to: '',
})

const filteredMaintenances = computed(() => {
  return (store.maintenances || []).filter((m) => {
    const machineOk =
      !filters.machine ||
      (m.machineName || '').toLowerCase().includes(filters.machine.toLowerCase())
    const sectorOk =
      !filters.sector ||
      (m.sector || '').toLowerCase().includes(filters.sector.toLowerCase())
    const statusOk = !filters.status || m.status === filters.status

    const date = m.scheduledDate || ''
    const fromOk = !filters.from || date >= filters.from
    const toOk = !filters.to || date <= filters.to

    return machineOk && sectorOk && statusOk && fromOk && toOk
  })
})

function clearFilters() {
  filters.machine = ''
  filters.sector = ''
  filters.status = ''
  filters.from = ''
  filters.to = ''
}

// ------- Status -------
function statusLabel(status) {
  const map = {
    pendente: 'Pendente',
    em_andamento: 'Em andamento',
    concluida: 'Concluída',
  }
  return map[status] || status || '—'
}

function statusPillClass(status) {
  const base =
    'bg-slate-100 text-slate-700 border border-slate-200'
  const map = {
    pendente: 'bg-amber-50 text-amber-700 border-amber-200',
    em_andamento: 'bg-sky-50 text-sky-700 border-sky-200',
    concluida: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }
  return map[status] || base
}

// ------- Navegação / ações -------
function goToDetails(m) {
  router.push({ name: 'maintenance-details', params: { id: m._id } })
}

async function remove(m) {
  const ok = window.confirm(`Deseja excluir a manutenção "${m.title}"?`)
  if (!ok) return
  await store.deleteMaintenance(m._id)
}

// ------- Formulário (criar/editar) -------
const showForm = ref(false)
const editing = ref(null)

const form = reactive({
  title: '',
  machineName: '',
  sector: '',
  technician: '',
  type: 'preventiva',
  priority: 'média',
  status: 'pendente',
  scheduledDate: '',
  description: '',
})

function openNew() {
  editing.value = null
  Object.assign(form, {
    title: '',
    machineName: '',
    sector: '',
    technician: '',
    type: 'preventiva',
    priority: 'média',
    status: 'pendente',
    scheduledDate: '',
    description: '',
  })
  showForm.value = true
}

function openEdit(m) {
  editing.value = m
  Object.assign(form, {
    title: m.title || '',
    machineName: m.machineName || '',
    sector: m.sector || '',
    technician: m.technician || '',
    type: m.type || 'preventiva',
    priority: m.priority || 'média',
    status: m.status || 'pendente',
    scheduledDate: m.scheduledDate || '',
    description: m.description || '',
  })
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

async function submitForm() {
  if (editing.value && editing.value._id) {
    await store.updateMaintenance(editing.value._id, { ...form })
  } else {
    await store.createMaintenance({ ...form })
  }
  showForm.value = false
}

// ------- Load inicial -------
onMounted(() => {
  store.fetchMaintenances()
})
</script>

<style scoped>
.input-filter {
  @apply w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs
    text-slate-800 placeholder:text-slate-400 focus:outline-none
    focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-400;
}

.input-form {
  @apply w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs
    text-slate-800 placeholder:text-slate-400 focus:outline-none
    focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-400;
}
</style>