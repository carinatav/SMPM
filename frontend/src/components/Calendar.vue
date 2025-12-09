<template>
  <div class="space-y-4">
    <!-- Cabeçalho do mês -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
          @click="prevMonth"
        >
          ‹
        </button>
        <p class="text-sm font-medium text-slate-800 capitalize">
          {{ monthLabel }}
        </p>
      </div>

      <div class="hidden md:flex items-center gap-2 text-xs text-slate-500">
        <span class="w-2 h-2 rounded-full bg-indigo-500" />
        <span>{{ totalEvents }} eventos carregados</span>
      </div>
    </div>

    <!-- Dias da semana -->
    <div class="grid grid-cols-7 gap-2 text-[11px] text-slate-400 uppercase tracking-wide">
      <span v-for="d in daysOfWeek" :key="d" class="text-center">
        {{ d }}
      </span>
    </div>

    <!-- Grid de dias -->
    <div class="grid grid-cols-7 gap-2 text-xs">
      <button
        v-for="(cell, idx) in cells"
        :key="cell ? cell.date : `empty-${idx}`"
        type="button"
        class="h-20 rounded-2xl border flex flex-col items-center justify-center transition
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        :class="cell ? dayClasses(cell) : 'border-transparent bg-transparent pointer-events-none'"
        @click="handleDayClick(cell)"
      >
        <!-- dia -->
        <span v-if="cell" class="text-sm font-medium mb-1">
          {{ cell.day }}
        </span>

        <!-- se tem manutenção nesse dia -->
        <template v-if="cell && cell.events.length">
          <!-- barrinha de status -->
          <div class="w-12 h-1.5 rounded-full mb-1" :class="barClass(cell)" />

          <!-- badge "ver (N)" -->
          <span
            class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px]
                   bg-indigo-50 text-indigo-700 border border-indigo-200"
          >
            <span class="text-[11px]"></span>
            <span>ver ({{ cell.events.length }})</span>
          </span>
        </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  // eventos com pelo menos scheduledDate/date e status
  events: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['day-selected'])

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth()) // 0-11

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// agrupa eventos por data (yyyy-mm-dd)
const eventsByDate = computed(() => {
  const map = {}
  for (const e of props.events || []) {
    const iso = (e.scheduledDate || e.date || '').slice(0, 10)
    if (!iso) continue
    if (!map[iso]) map[iso] = []
    map[iso].push(e)
  }
  return map
})

const totalEvents = computed(() => (props.events || []).length)

const monthLabel = computed(() => {
  const d = new Date(currentYear.value, currentMonth.value, 1)
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
})

// células do calendário (nulos para preencher antes do dia 1)
const cells = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const first = new Date(year, month, 1)
  const lastDayNumber = new Date(year, month + 1, 0).getDate()
  const firstWeekDay = first.getDay() // 0 = domingo

  const arr = []

  // espaços antes do dia 1
  for (let i = 0; i < firstWeekDay; i++) {
    arr.push(null)
  }

  // dias do mês
  for (let day = 1; day <= lastDayNumber; day++) {
    const dateStr = formatISO(year, month, day)
    arr.push({
      day,
      date: dateStr,
      events: eventsByDate.value[dateStr] || [],
    })
  }

  return arr
})

function formatISO(year, monthIndex, day) {
  const m = String(monthIndex + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
}

function handleDayClick(cell) {
  if (!cell) return
  emit('day-selected', {
    date: cell.date,
    events: cell.events,
  })
}

function dayClasses(cell) {
  if (!cell) return ''

  if (cell.events.length > 0) {
    return 'bg-indigo-50 border-indigo-300 text-slate-900 hover:bg-indigo-100'
  }

  return 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
}

function barClass(cell) {
  const hasConcluida = cell.events.some((e) => e.status === 'concluida')
  const hasEmAndamento = cell.events.some((e) => e.status === 'em_andamento')

  if (hasConcluida && !hasEmAndamento) return 'bg-emerald-400'
  if (hasEmAndamento) return 'bg-sky-400'
  return 'bg-amber-400'
}
</script>