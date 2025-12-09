<template>
  <div class="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60">
    <table class="min-w-full text-sm">
      <thead class="bg-slate-900/80 text-slate-400 uppercase text-[11px] tracking-[0.18em]">
        <tr>
          <th class="px-4 py-3 text-left">Título</th>
          <th class="px-4 py-3 text-left">Máquina</th>
          <th class="px-4 py-3 text-left">Setor</th>
          <th class="px-4 py-3 text-left">Tipo</th>
          <th class="px-4 py-3 text-left">Prioridade</th>
          <th class="px-4 py-3 text-left">Status</th>
          <th class="px-4 py-3 text-left">Data</th>
          <th class="px-4 py-3 text-right">Ações</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-800/70">
        <tr
          v-for="item in items"
          :key="item.id"
          class="hover:bg-slate-900/60 transition"
        >
          <td class="px-4 py-3 text-slate-100">
            {{ item.title }}
          </td>
          <td class="px-4 py-3 text-slate-300">
            {{ item.machineName || item.machineId || '—' }}
          </td>
          <td class="px-4 py-3 text-slate-300">
            {{ item.sector || '—' }}
          </td>
          <td class="px-4 py-3 capitalize text-slate-300">
            {{ item.type }}
          </td>
          <td class="px-4 py-3 capitalize text-slate-300">
            {{ item.priority }}
          </td>
          <td class="px-4 py-3">
            <span
              class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border"
              :class="statusClass(item.status)"
            >
              {{ statusLabel(item.status) }}
            </span>
          </td>
          <td class="px-4 py-3 text-slate-300">
            {{ item.scheduledDate || item.date }}
          </td>
          <td class="px-4 py-3 text-right space-x-2">
  <button
    class="inline-flex items-center px-3 py-1.5 rounded-full text-xs border border-slate-700/80
           bg-slate-900/70 hover:border-indigo-400/70 hover:text-indigo-200 transition"
    @click="$emit('view', item._id || item.id)"
  >
    Ver
  </button>
  <button
    class="inline-flex items-center px-3 py-1.5 rounded-full text-xs border border-rose-500/40
           bg-rose-500/10 text-rose-200 hover:bg-rose-500/20 transition"
    @click="$emit('delete', item._id || item.id)"
  >
    Excluir
  </button>
</td>
        </tr>

        <tr v-if="!items.length">
          <td colspan="8" class="px-4 py-6 text-center text-slate-500 text-sm">
            Nenhuma manutenção encontrada.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['view', 'delete'])

function statusLabel(status) {
  const map = {
    pendente: 'Pendente',
    em_andamento: 'Em andamento',
    concluida: 'Concluída',
    atrasada: 'Atrasada',
  }
  return map[status] || status
}

function statusClass(status) {
  const base = 'backdrop-blur'
  const map = {
    pendente: 'bg-amber-400/10 text-amber-300 border-amber-500/40',
    em_andamento: 'bg-sky-400/10 text-sky-300 border-sky-500/40',
    concluida: 'bg-emerald-400/10 text-emerald-300 border-emerald-500/40',
    atrasada: 'bg-rose-500/10 text-rose-300 border-rose-500/40',
  }
  return `${base} ${map[status] || 'bg-slate-500/10 text-slate-200 border-slate-500/40'}`
}
</script>