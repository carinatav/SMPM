<template>
  <form class="space-y-3" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1">Título</label>
        <input
          v-model="localForm.title"
          type="text"
          class="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs
                 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          placeholder="Ex: Troca de óleo da máquina A"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1">Máquina</label>
        <input
          v-model="localForm.machineName"
          type="text"
          class="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs
                 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          placeholder="Ex: Compressor A"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1">Setor</label>
        <input
          v-model="localForm.sector"
          type="text"
          class="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs
                 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          placeholder="Ex: Produção"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1">Técnico responsável</label>
        <input
          v-model="localForm.technician"
          type="text"
          class="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs
                 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          placeholder="Ex: João Silva"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1">Tipo</label>
        <select
          v-model="localForm.type"
          class="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs
                 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
        >
          <option value="preventiva">Preventiva</option>
          <option value="corretiva">Corretiva</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1">Prioridade</label>
        <select
          v-model="localForm.priority"
          class="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs
                 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
        >
          <option value="baixa">Baixa</option>
          <option value="média">Média</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1">Status</label>
        <select
          v-model="localForm.status"
          class="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs
                 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
        >
          <option value="pendente">Pendente</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluida">Concluída</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-300 mb-1">Data agendada</label>
        <input
          v-model="localForm.scheduledDate"
          type="date"
          class="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs
                 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
        />
      </div>
    </div>

    <div>
      <label class="block text-xs font-medium text-slate-300 mb-1">Descrição</label>
      <textarea
        v-model="localForm.description"
        rows="3"
        class="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs
               text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
        placeholder="Detalhes adicionais da manutenção..."
      />
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <button
        type="button"
        class="px-3 py-1.5 rounded-full text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-200"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>

      <button
        type="submit"
        class="px-4 py-1.5 rounded-full text-xs bg-indigo-500 hover:bg-indigo-600 text-white shadow
               shadow-indigo-500/40"
      >
        {{ mode === 'edit' ? 'Salvar alterações' : 'Criar manutenção' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'create', // 'create' | 'edit'
  },
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const localForm = reactive({
  _id: null,
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

// sincroniza props -> formulário interno
watch(
  () => props.modelValue,
  (val) => {
    Object.assign(localForm, {
      _id: val?._id || null,
      title: val?.title || '',
      machineName: val?.machineName || '',
      sector: val?.sector || '',
      technician: val?.technician || '',
      type: val?.type || 'preventiva',
      priority: val?.priority || 'média',
      status: val?.status || 'pendente',
      scheduledDate: val?.scheduledDate || '',
      description: val?.description || '',
    })
  },
  { immediate: true, deep: true },
)

function onSubmit() {
  emit('update:modelValue', { ...localForm })
  emit('submit')
}
</script>