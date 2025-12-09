<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow w-96">
      <slot></slot>
      <button @click="$emit('close')" class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Fechar</button>
    </div>
  </div>
</template>

<script>
export default { props: ['show'] };
</script>

<style scoped>
</style>