<template>
  <div class="flex justify-center py-8">
    <div v-if="loading" class="mt-20 text-gray-500">Loading card...</div>

    <div v-else-if="student" class="w-full max-w-sm">
      <div class="overflow-hidden shadow-2xl bg-primary rounded-2xl">

        <div class="flex items-center justify-between px-6 py-3 bg-accent">
          <span class="text-sm font-bold text-primary">COLLEGE NAME</span>
          <span class="text-xs font-semibold text-primary">STUDENT ID CARD</span>
        </div>

        <div class="px-6 py-6">
          <div class="flex justify-center mb-4">
            <div
              class="flex items-center justify-center w-24 h-24 overflow-hidden bg-gray-200 border-4 rounded-full border-accent">
              <span class="text-4xl font-bold text-gray-400">
                {{ student.full_name?.charAt(0) }}
              </span>
            </div>
          </div>

          <div class="mb-6 text-center">
            <h2 class="text-xl font-bold text-white">{{ student.full_name }}</h2>
            <p class="text-accent text-sm font-semibold mt-0.5">{{ student.Department?.name }}</p>
          </div>

          <div class="mb-6 space-y-2">
            <div class="flex justify-between">
              <span class="text-xs text-gray-400">Student ID</span>
              <span class="text-xs font-semibold text-white">{{ student.student_id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-gray-400">Year</span>
              <span class="text-xs font-semibold text-white">Year {{ student.year }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-gray-400">Faculty</span>
              <span class="text-xs font-semibold text-white">{{ student.Department?.faculty }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-gray-400">Email</span>
              <span class="text-xs font-semibold text-white">{{ student.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-gray-400">Status</span>
              <span class="text-xs font-semibold text-green-400 uppercase">{{ student.status }}</span>
            </div>
          </div>

          <!-- QR Code as image -->
          <div class="flex justify-center p-3 bg-white rounded-xl">
            <img v-if="qrDataUrl" :src="qrDataUrl" width="150" height="150" alt="QR Code" />
            <div v-else class="flex items-center justify-center text-xs text-gray-400 w-36 h-36">
              No QR code
            </div>
          </div>
          <p class="mt-2 text-xs text-center text-gray-400">Scan to verify identity</p>
        </div>

        <div class="px-6 py-2 text-center bg-accent">
          <span class="text-xs font-semibold text-primary">
            Valid Until: {{ expiryDate }}
          </span>
        </div>

      </div>

      <button @click="() => window.print()"
        class="w-full mt-4 bg-accent text-primary font-semibold py-2.5 rounded-lg hover:opacity-90 transition">
        Download Card
      </button>
    </div>

    <div v-else class="mt-20 text-red-500">Student not found.</div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const auth = useAuthStore()

const student = ref(null)
const loading = ref(true)
const qrDataUrl = ref('')
const expiryDate = ref('')

onMounted(async () => {
  auth.loadFromStorage()

  try {
    const res = await $fetch(`http://localhost:5000/api/students/${route.params.id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    student.value = res

    if (res.Card?.expires_at) {
      expiryDate.value = new Date(res.Card.expires_at).toLocaleDateString()
    }

    if (res.Card?.qr_token) {
      try {
        const QRCode = await import('qrcode')
        qrDataUrl.value = await QRCode.default.toDataURL(res.Card.qr_token, {
          width: 150,
          margin: 1,
          color: { dark: '#1e3a5f', light: '#ffffff' }
        })
      } catch (qrErr) {
        console.error('QR generation failed:', qrErr)
      }
    }

  } catch (err) {
    console.error('Card fetch error:', err)
  } finally {
    loading.value = false
  }
})
</script>