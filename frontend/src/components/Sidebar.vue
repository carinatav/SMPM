<template>
  <aside
    class="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/90
           py-6 px-4 gap-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
  >
    <!-- TOPO MAIS LIMPO -->
    <div class="px-1">
      <h1 class="text-lg font-semibold text-slate-900">
        SMPM
      </h1>
    </div>

    <nav class="flex-1 flex flex-col gap-1 mt-2 text-sm">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="group flex items-center gap-3 px-3 py-2 rounded-xl transition
               text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        :class="{
          'bg-slate-900 text-white shadow-sm hover:bg-slate-900':
            $route.path === item.to
        }"
      >
        <span
          class="inline-flex items-center justify-center w-8 h-8 rounded-xl
                 border text-xs"
          :class="$route.path === item.to
            ? 'bg-slate-800 border-slate-700 text-slate-100'
            : 'bg-slate-50 border-slate-200 text-slate-500 group-hover:border-slate-400'"
        >
          {{ item.icon }}
        </span>
        <div class="flex flex-col">
          <span class="font-medium">
            {{ item.label }}
          </span>
          <span class="text-[10px] text-slate-400">
            {{ item.subtitle }}
          </span>
        </div>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'

useRoute()

const items = [
  { to: '/', label: 'Dashboard',      subtitle: 'Visão geral',    icon: '📊' },
  { to: '/calendar', label: 'Calendário',    subtitle: 'Agenda',        icon: '📅' },
  { to: '/maintenances', label: 'Manutenções', subtitle: 'Atividades', icon: '🛠️' },
  { to: '/machines', label: 'Máquinas',   subtitle: 'Equipamentos',    icon: '🏭' },
]
</script>