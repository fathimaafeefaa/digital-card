<template>
  <div class="min-h-screen bg-primary flex items-center justify-center px-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-white text-3xl font-bold">C</span>
        </div>
        <h1 class="text-2xl font-bold text-primary">College Digital Card</h1>
        <p class="text-gray-500 text-sm mt-1">Sign in to access your digital ID</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
        {{ error }}
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="you@college.edu"
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            @keyup.enter="login"
          />
        </div>
        <button
          @click="login"
          :disabled="loading"
          class="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </div>

      <!-- Test credentials -->
      <div class="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
        <p class="font-semibold mb-1">Test Credentials:</p>
        <p>Admin: admin@college.edu / admin123</p>
        <p>Student: ahmed@college.edu / student123</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false })

const auth = useAuthStore()
const router = useRouter()
const config = useRuntimeConfig()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const login = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: form
    })
    auth.setAuth(res.token, res.user)
    if (res.user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push(`/card/${res.user.studentId}`)
    }
  } catch (err) {
    error.value = err?.data?.message || 'Login failed. Check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>
