<template>
  <div
    class="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br
           from-slate-900/90 via-slate-900/70 to-slate-950/80 px-4 py-3 flex flex-col gap-1.5
           shadow-[0_18px_40px_rgba(0,0,0,0.55)]"
  >
    <p class="text-[11px] uppercase tracking-[0.25em] text-slate-500">
      {{ label }}
    </p>
    <p class="text-2xl font-semibold text-slate-50">
      {{ value }}
    </p>
    <p v-if="subtitle" class="text-xs text-slate-500">
      {{ subtitle }}
    </p>

    <div class="pointer-events-none absolute -right-4 -bottom-6 w-24 h-24 rounded-full
                bg-gradient-to-tr from-indigo-500/25 via-fuchsia-500/20 to-emerald-400/20
                blur-xl opacity-70" />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  subtitle: {
    type: String,
    default: '',
  },
})
</script>