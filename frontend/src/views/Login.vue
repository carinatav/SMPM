<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300"
  >
    <div
      class="max-w-md w-full bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.35)] rounded-3xl p-6 md:p-8"
    >
      <!-- TÍTULO MINIMALISTA -->
      <div class="mb-6 text-center">
        <p class="text-sm text-slate-500">
          Sistema de Manutenção Preventiva de Máquinas
        </p>
      </div>

      <h2 class="text-lg font-medium text-slate-900 text-center">
        Acessar painel
      </h2>

      <!-- LOGIN NORMAL -->
      <form class="space-y-3 mt-4" @submit.prevent="handleLogin">
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
          <span v-if="!loading">Entrar</span>
          <span v-else>Entrando...</span>
        </button>
      </form>

      <!-- DIVISOR -->
      <div class="flex items-center my-4">
        <div class="flex-1 h-px bg-slate-200"></div>
        <span class="px-3 text-[11px] uppercase tracking-[0.2em] text-slate-400">ou</span>
        <div class="flex-1 h-px bg-slate-200"></div>
      </div>

      <!-- GOOGLE LOGIN -->
      <button
        type="button"
        class="w-full inline-flex items-center justify-center gap-2 border border-slate-300 rounded-full py-2 text-sm text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-60"
        @click="signInWithGoogle"
        :disabled="googleLoading"
      >
        <svg class="w-4 h-4" viewBox="0 0 533.5 544.3" aria-hidden="true">
          <path
            fill="#4285f4"
            d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.3h147.4c-6.4 34.8-25.9 64.3-55.1 84.1l89.1 69.1c52-48 80.1-118.7 80.1-198.1z"
          />
          <path
            fill="#34a853"
            d="M272 544.3c72.9 0 134.1-24.1 178.8-65.3l-89.1-69.1c-24.8 16.7-56.6 26.5-89.7 26.5-68.9 0-127.4-46.4-148.3-108.8l-91.7 71c42.5 84 129.2 145.7 239.9 145.7z"
          />
          <path
            fill="#fbbc04"
            d="M123.7 327.6c-10.5-31.4-10.5-65.6 0-97l-91.7-71C4.5 207.4 0 232.1 0 258.5s4.5 51.1 32 99.9l91.7-71z"
          />
          <path
            fill="#ea4335"
            d="M272 107.7c39.6-.6 77.6 14 106.5 41.4l79.4-79.4C404.8 24.7 344.1.3 272 0 161.3 0 74.6 61.7 32 145.7l91.7 71C144.6 154.3 203.1 107.9 272 107.7z"
          />
        </svg>
        <span v-if="!googleLoading">Entrar com Google</span>
        <span v-else>Conectando...</span>
      </button>

      <!-- LINK CRIAR CADASTRO -->
      <button
        class="w-full inline-flex justify-center mt-4 py-2 rounded-full text-xs text-slate-600 hover:text-slate-900"
        @click.prevent="router.push('/register')"
      >
        Não tem conta?
        <span class="ml-1 underline">Criar cadastro</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const googleLoading = ref(false)

// LOGIN NORMAL
async function handleLogin() {
  try {
    loading.value = true
    error.value = ''

    const { data } = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    })

    localStorage.setItem('token', data.token)
    localStorage.setItem('userName', data.user.name || '')

    if (data.user.avatar) {
      localStorage.setItem('userPhoto', data.user.avatar)
    } else {
      localStorage.removeItem('userPhoto')
    }

    router.push({ name: 'dashboard' })
  } catch (err) {
    console.error(err)
    error.value = 'E-mail ou senha inválidos.'
  } finally {
    loading.value = false
  }
}

// LOGIN COM GOOGLE (redireciona pro backend)
function signInWithGoogle() {
  try {
    googleLoading.value = true
    error.value = ''
    const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
    window.location.href = `${base}/auth/google`
  } catch (err) {
    console.error(err)
    googleLoading.value = false
    error.value = 'Erro ao iniciar login com Google.'
  }
}

// QUANDO VOLTA DO GOOGLE: /login?googleToken=...&name=...&avatar=...
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const googleToken = params.get('googleToken')

  if (googleToken) {
    const name = params.get('name') || 'Usuário Google'
    const avatar = params.get('avatar') || ''

    localStorage.setItem('token', googleToken)
    localStorage.setItem('userName', name)

    if (avatar) {
      localStorage.setItem('userPhoto', avatar)
    } else {
      localStorage.removeItem('userPhoto')
    }

    // limpa a query string da URL
    const clean = window.location.origin + route.path
    window.history.replaceState({}, '', clean)

    router.push({ name: 'dashboard' })
  }
})
</script>