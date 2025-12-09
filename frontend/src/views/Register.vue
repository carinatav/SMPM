<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300"
  >
    <div
      class="max-w-md w-full bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.35)] rounded-3xl p-6 md:p-8"
    >
      <div class="mb-6 text-center">
        <p class="text-[11px] uppercase tracking-[0.28em] text-slate-400">Senai</p>
        <h1 class="text-xl font-semibold text-slate-900">SMPM</h1>
      </div>

      <h2 class="text-lg font-medium text-slate-900 text-center">
        Criar conta
      </h2>

      <form class="space-y-3 mt-4" @submit.prevent="handleRegister">
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1">Nome</label>
          <input
            v-model="name"
            class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1">E-mail</label>
          <input
            v-model="email"
            type="email"
            class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1">Senha</label>
          <input
            v-model="password"
            type="password"
            class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <p v-if="error" class="text-xs text-rose-500 mt-1">
          {{ error }}
        </p>

        <button
          type="submit"
          class="w-full mt-3 inline-flex items-center justify-center gap-2 bg-indigo-500 text-white rounded-full py-2 text-sm hover:bg-indigo-600 shadow disabled:opacity-60"
          :disabled="loading"
        >
          <span v-if="!loading">Criar conta</span>
          <span v-else>Criando...</span>
        </button>

        <button
          class="w-full inline-flex justify-center mt-3 py-2 rounded-full text-xs text-slate-600 hover:text-slate-900"
          @click.prevent="router.push('/login')"
        >
          Já tenho conta
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  try {
    error.value = ''
    loading.value = true

    await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })

    router.push('/login')
  } catch (err) {
    console.error(err)
    error.value = 'Não foi possível criar conta.'
  } finally {
    loading.value = false
  }
}
</script>