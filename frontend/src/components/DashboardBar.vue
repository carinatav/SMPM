<template>
  <div class="flex items-center gap-3">
    <span :class="['w-2 h-2 rounded-full', color]"></span>
    <span class="w-28">{{ label }}</span>

    <div class="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
      <div
        class="h-full transition-all duration-500"
        :class="color"
        :style="{ width: percent + '%' }"
      ></div>
    </div>

    <span>{{ value }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: Number,
  total: Number,
  color: String
})

const percent = computed(() => {
  if (!props.total) return 0
  return Math.round((props.value / props.total) * 100)
})
</script>