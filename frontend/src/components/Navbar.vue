<template>
  <header
    class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/90 backdrop-blur-md"
  >
    <div>
      <p class="text-[11px] tracking-[0.28em] uppercase text-slate-400">
        Sistema
      </p>
      <p class="text-sm md:text-base font-medium text-slate-900">
        Sistema de Manutenção Preventiva de Máquinas
      </p>
    </div>

    <div class="flex items-center gap-3">
      <!-- Chip do usuário, mais simples -->
      <div
        class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200"
      >
        <div
          v-if="avatarUrl"
          class="w-8 h-8 rounded-full overflow-hidden border border-slate-300"
        >
          <img
            :src="avatarUrl"
            alt="Foto do usuário"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500
                 flex items-center justify-center text-[11px] font-semibold text-white"
        >
          {{ initials }}
        </div>

        <span class="text-sm font-medium text-slate-900">
          {{ userName }}
        </span>
      </div>

      <button
        class="px-4 py-1.5 rounded-full text-xs font-medium bg-slate-900 hover:bg-slate-800
               text-white shadow-sm"
        @click="logout"
      >
        Sair
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userName = computed(() => localStorage.getItem('userName') || 'Usuário')
const avatarUrl = computed(() => localStorage.getItem('userAvatar') || '')

const initials = computed(() => {
  if (avatarUrl.value) return '' // se tem foto, não precisa de iniciais
  const parts = userName.value.split(' ').filter(Boolean)
  const letters = parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '')
  return letters.join('') || 'US'
})

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  localStorage.removeItem('userAvatar')
  router.push({ name: 'login' })
}
</script>