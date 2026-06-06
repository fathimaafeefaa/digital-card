<template>
  <div class="flex items-center justify-center min-h-screen px-4 bg-primary">
    <div class="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">

      <!-- Header -->
      <div class="mb-8 text-center">
        <div class="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-primary">
          <span class="text-3xl font-bold text-white">C</span>
        </div>
        <h1 class="text-2xl font-bold text-primary">College Digital Card</h1>
        <p class="mt-1 text-sm text-gray-500">Sign in to access your digital ID</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="px-4 py-3 mb-4 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
        {{ error }}
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" placeholder="you@college.edu"
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Password</label>
          <input v-model="form.password" type="password" placeholder="••••••••"
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            @keyup.enter="login" />
        </div>
        <button @click="login" :disabled="loading"
          class="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </div>

      <!-- Test credentials -->
      <div class="p-4 mt-6 text-xs text-gray-500 rounded-lg bg-gray-50">
        <p class="mb-1 font-semibold">Test Credentials:</p>
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

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const error = ref('')

const login = async () => {
  error.value = ''
  loading.value = true
  try {
    const res = await $fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password })
    })
    auth.setAuth(res.token, res.user)
    if (res.user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push(`/card/${res.user.studentId}`)
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = err?.data?.message || 'Login failed. Check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>