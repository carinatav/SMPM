<template>
  <div class="min-h-screen bg-slate-100">
    <div class="flex min-h-screen">
      <!-- Sidebar fixa -->
      <Sidebar />

      <!-- Área principal -->
      <div class="flex-1 flex flex-col">
        <Navbar />

        <!-- Conteúdo -->
        <main class="px-4 py-6 md:px-8 md:py-8">
          <div class="max-w-6xl mx-auto">
            <RouterView />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
</script>