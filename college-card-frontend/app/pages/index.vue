<template>
  <div class="min-h-screen flex flex-col" style="background: #1a3a5c;">

    <!-- EAU Header -->
    <div class="px-6 py-10 text-center">
      <div class="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style="background: #c8a84b;">
        <span class="font-black text-2xl" style="color: #1a3a5c;">EAU</span>
      </div>
      <h1 class="text-white font-bold text-xl">Emirates Aviation University</h1>
      <p class="text-sm mt-1" style="color: #c8a84b;">Digital Student Card Portal</p>
    </div>

    <!-- Card -->
    <div class="flex-1 flex items-start justify-center px-4 pb-10">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        <!-- Tabs -->
        <div class="flex border-b border-gray-100">
          <button @click="activeTab = 'student'" class="flex-1 py-4 text-sm font-semibold transition" :style="activeTab === 'student'
            ? 'color: #1a3a5c; border-bottom: 3px solid #c8a84b;'
            : 'color: #9ca3af;'">
            Student Login
          </button>
          <button @click="activeTab = 'admin'" class="flex-1 py-4 text-sm font-semibold transition" :style="activeTab === 'admin'
            ? 'color: #1a3a5c; border-bottom: 3px solid #c8a84b;'
            : 'color: #9ca3af;'">
            Admin Login
          </button>
        </div>

        <div class="px-8 py-8">

          <!-- Error -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {{ error }}
          </div>

          <!-- Success -->
          <div v-if="successMsg"
            class="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-3 mb-4">
            {{ successMsg }}
          </div>

          <!-- STUDENT LOGIN TAB -->
          <div v-if="activeTab === 'student'">
            <p class="text-gray-500 text-sm mb-6 text-center">
              Login with your Student ID and password
            </p>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input v-model="studentForm.student_id" type="text" placeholder="EAU-AVM-2021-001"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style="focus:ring-color: #1a3a5c;" @keyup.enter="studentLogin" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input v-model="studentForm.password" type="password" placeholder="••••••••"
                  class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  @keyup.enter="studentLogin" />
              </div>
              <button @click="studentLogin" :disabled="loading"
                class="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                style="background: #1a3a5c;">
                {{ loading ? 'Logging in...' : 'Login' }}
              </button>
            </div>

            <!-- Test credentials hint -->
            <div class="mt-6 p-3 rounded-lg text-xs text-gray-400 border border-gray-100 text-center">
              <p class="font-semibold mb-1 text-gray-500">Test credentials</p>
              <p>ID: EAU-AVM-2021-001</p>
              <p>Password: student123</p>
            </div>
          </div>

          <!-- ADMIN LOGIN TAB -->
          <div v-if="activeTab === 'admin'">

            <!-- Step 1: Email -->
            <div v-if="adminStep === 1">
              <p class="text-gray-500 text-sm mb-6 text-center">
                Enter your admin email to receive a login code
              </p>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                  <input v-model="adminForm.email" type="email" placeholder="admin@eau.ac.ae"
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
                    @keyup.enter="requestOTP" />
                </div>
                <button @click="requestOTP" :disabled="loading"
                  class="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                  style="background: #1a3a5c;">
                  {{ loading ? 'Sending code...' : 'Send Login Code' }}
                </button>
              </div>
            </div>

            <!-- Step 2: OTP -->
            <div v-if="adminStep === 2">
              <p class="text-gray-500 text-sm mb-2 text-center">Enter the 6-digit code sent to</p>
              <p class="font-semibold text-center mb-6 text-sm" style="color: #1a3a5c;">{{ adminForm.email }}</p>

              <div class="space-y-4">
                <div class="flex gap-2 justify-center">
                  <input v-for="(_, i) in 6" :key="i" v-model="otp[i]" type="text" maxlength="1"
                    class="otp-input w-12 h-12 border border-gray-300 rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2"
                    @input="handleOtpInput(i, $event)" @keydown="handleOtpKeydown(i, $event)" />
                </div>

                <button @click="verifyOTP" :disabled="loading"
                  class="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                  style="background: #1a3a5c;">
                  {{ loading ? 'Verifying...' : 'Verify & Login' }}
                </button>

                <button @click="adminStep = 1; otp = ['', '', '', '', '', '']; error = ''"
                  class="w-full text-sm py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
                  ← Use different email
                </button>

                <p class="text-center text-xs text-gray-400">
                  Didn't receive the code?
                  <button @click="requestOTP" class="underline font-semibold" style="color: #1a3a5c;">
                    Resend
                  </button>
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="py-4 text-center">
      <p class="text-xs" style="color: rgba(255,255,255,0.4);">© Emirates Aviation University — Student Portal</p>
    </div>

  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false })

const auth = useAuthStore()
const router = useRouter()

const activeTab = ref('student')
const loading = ref(false)
const error = ref('')
const successMsg = ref('')

// Student login
const studentForm = reactive({ student_id: '', password: '' })

// Admin OTP login
const adminForm = reactive({ email: '' })
const adminStep = ref(1)
const otp = ref(['', '', '', '', '', ''])

const studentLogin = async () => {
  error.value = ''
  if (!studentForm.student_id || !studentForm.password) {
    error.value = 'Please enter your Student ID and password'
    return
  }
  loading.value = true
  try {
    const res = await $fetch('http://localhost:5000/api/auth/student-login', {
      method: 'POST',
      body: {
        student_id: studentForm.student_id,
        password: studentForm.password
      }
    })
    auth.setAuth(res.token, res.user)
    router.push(`/card/${res.user.studentId}`)
  } catch (err) {
    error.value = err?.data?.message || 'Login failed. Check your credentials.'
  } finally {
    loading.value = false
  }
}

const requestOTP = async () => {
  error.value = ''
  successMsg.value = ''
  if (!adminForm.email) {
    error.value = 'Please enter your email'
    return
  }
  loading.value = true
  try {
    await $fetch('http://localhost:5000/api/auth/request-otp', {
      method: 'POST',
      body: { email: adminForm.email }
    })
    successMsg.value = 'Code sent! Check your email inbox.'
    adminStep.value = 2
  } catch (err) {
    error.value = err?.data?.message || 'Failed to send code. Try again.'
  } finally {
    loading.value = false
  }
}

const verifyOTP = async () => {
  error.value = ''
  const otpCode = otp.value.join('')
  if (otpCode.length !== 6) {
    error.value = 'Please enter the full 6-digit code'
    return
  }
  loading.value = true
  try {
    const res = await $fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      body: { email: adminForm.email, code: otpCode }
    })
    auth.setAuth(res.token, res.user)
    router.push('/admin')
  } catch (err) {
    error.value = err?.data?.message || 'Invalid code. Try again.'
    otp.value = ['', '', '', '', '', '']
  } finally {
    loading.value = false
  }
}

const handleOtpInput = (index, event) => {
  const value = event.target.value
  if (value.length > 1) {
    otp.value[index] = value[value.length - 1]
  }
  if (value && index < 5) {
    const inputs = document.querySelectorAll('.otp-input')
    if (inputs[index + 1]) inputs[index + 1].focus()
  }
}

const handleOtpKeydown = (index, event) => {
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    const inputs = document.querySelectorAll('.otp-input')
    if (inputs[index - 1]) inputs[index - 1].focus()
  }
}
</script>