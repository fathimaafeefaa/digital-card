<template>
  <div class="flex items-center justify-center min-h-screen px-4" style="background: #1a3a5c;">

    <div class="w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl">

      <!-- EAU Header -->
      <div style="background: #1a3a5c;" class="px-8 py-8 text-center">
        <div class="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full" style="background: #c8a84b;">
          <span class="text-2xl font-bold text-white">EAU</span>
        </div>
        <h1 class="text-xl font-bold text-white">Emirates Aviation University</h1>
        <p style="color: #c8a84b;" class="mt-1 text-sm">Digital Student Card Portal</p>
      </div>

      <!-- Form -->
      <div class="px-8 py-8">

        <!-- Error -->
        <div v-if="error" class="px-4 py-3 mb-4 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
          {{ error }}
        </div>

        <!-- Success -->
        <div v-if="successMsg"
          class="px-4 py-3 mb-4 text-sm text-green-600 border border-green-200 rounded-lg bg-green-50">
          {{ successMsg }}
        </div>

        <!-- Step 1: Email -->
        <div v-if="step === 1">
          <p class="mb-6 text-sm text-center text-gray-600">
            Enter your EAU email address to receive a login code
          </p>
          <div class="mb-4">
            <label class="block mb-1 text-sm font-medium text-gray-700">EAU Email Address</label>
            <input v-model="email" type="email" placeholder="yourname@eau.ac.ae"
              class="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style="--tw-ring-color: #1a3a5c;" @keyup.enter="requestOTP" />
          </div>
          <button @click="requestOTP" :disabled="loading"
            class="w-full py-3 font-semibold text-white transition rounded-lg hover:opacity-90 disabled:opacity-50"
            style="background: #1a3a5c;">
            {{ loading ? 'Sending code...' : 'Send Login Code' }}
          </button>
        </div>

        <!-- Step 2: OTP -->
        <div v-if="step === 2">
          <p class="mb-2 text-sm text-center text-gray-600">
            Enter the 6-digit code sent to
          </p>
          <p class="mb-6 font-semibold text-center" style="color: #1a3a5c;">{{ email }}</p>

          <div class="mb-4">
            <label class="block mb-1 text-sm font-medium text-gray-700">Verification Code</label>
            <input v-model="otp" type="text" maxlength="6" placeholder="000000"
              class="w-full px-4 py-3 text-2xl font-bold tracking-widest text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              @keyup.enter="verifyOTP" />
          </div>

          <button @click="verifyOTP" :disabled="loading"
            class="w-full py-3 mb-3 font-semibold text-white transition rounded-lg hover:opacity-90 disabled:opacity-50"
            style="background: #1a3a5c;">
            {{ loading ? 'Verifying...' : 'Verify & Login' }}
          </button>

          <button @click="step = 1; otp = ''; error = ''"
            class="w-full py-2 text-sm text-gray-500 transition border border-gray-200 rounded-lg hover:bg-gray-50">
            ← Use different email
          </button>

          <p class="mt-4 text-xs text-center text-gray-400">
            Didn't receive the code?
            <button @click="requestOTP" class="underline" style="color: #1a3a5c;">Resend</button>
          </p>
        </div>

      </div>

      <!-- Footer -->
      <div class="px-8 py-4 text-center border-t border-gray-100">
        <p class="text-xs text-gray-400">© Emirates Aviation University — Student Portal</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false })

const auth = useAuthStore()
const router = useRouter()

const step = ref(1)
const email = ref('')
const otp = ref('')
const loading = ref(false)
const error = ref('')
const successMsg = ref('')

const requestOTP = async () => {
  error.value = ''
  successMsg.value = ''
  if (!email.value) return error.value = 'Please enter your email'
  loading.value = true
  try {
    await $fetch('http://localhost:5000/api/auth/request-otp', {
      method: 'POST',
      body: { email: email.value }
    })
    successMsg.value = 'Code sent! Check your email inbox.'
    step.value = 2
  } catch (err) {
    error.value = err?.data?.message || 'Failed to send code. Try again.'
  } finally {
    loading.value = false
  }
}

const verifyOTP = async () => {
  error.value = ''
  if (!otp.value || otp.value.length !== 6) return error.value = 'Enter the 6-digit code'
  loading.value = true
  try {
    const res = await $fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      body: { email: email.value, code: otp.value }
    })
    auth.setAuth(res.token, res.user)
    if (res.user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push(`/card/${res.user.studentId}`)
    }
  } catch (err) {
    error.value = err?.data?.message || 'Invalid code. Try again.'
  } finally {
    loading.value = false
  }
}
</script>