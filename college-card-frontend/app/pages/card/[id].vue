<template>
  <div class="flex justify-center">
    <div v-if="loading" class="mt-20 text-gray-500">Loading card...</div>

    <div v-else-if="student" class="w-full max-w-sm">

      <!-- Card Front -->
      <div class="overflow-hidden shadow-2xl bg-primary rounded-2xl">

        <!-- Top banner -->
        <div class="flex items-center justify-between px-6 py-3 bg-accent">
          <span class="text-sm font-bold text-primary">COLLEGE NAME</span>
          <span class="text-xs font-semibold text-primary">STUDENT ID CARD</span>
        </div>

        <!-- Card body -->
        <div class="px-6 py-6">
          <!-- Photo -->
          <div class="flex justify-center mb-4">
            <div
              class="flex items-center justify-center w-24 h-24 overflow-hidden bg-gray-200 border-4 rounded-full border-accent">
              <img v-if="student.photo_url" :src="student.photo_url" class="object-cover w-full h-full" />
              <span v-else class="text-4xl font-bold text-gray-400">
                {{ student.full_name?.charAt(0) }}
              </span>
            </div>
          </div>

          <!-- Name -->
          <div class="mb-6 text-center">
            <h2 class="text-xl font-bold text-white">{{ student.full_name }}</h2>
            <p class="text-accent text-sm font-semibold mt-0.5">{{ student.Department?.name }}</p>
          </div>

          <!-- Details -->
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

          <!-- QR Code -->
          <div class="flex justify-center p-3 bg-white rounded-xl">
            <canvas ref="qrCanvas"></canvas>
          </div>
          <p class="mt-2 text-xs text-center text-gray-400">Scan to verify identity</p>

        </div>

        <!-- Bottom -->
        <div class="px-6 py-2 text-center bg-accent">
          <span class="text-xs font-semibold text-primary">
            Valid Until: {{ expiryDate }}
          </span>
        </div>

      </div>

      <!-- Download button -->
      <button @click="downloadCard"
        class="w-full mt-4 bg-accent text-primary font-semibold py-2.5 rounded-lg hover:opacity-90 transition">
        Download Card
      </button>

    </div>

    <div v-else class="mt-20 text-red-500">Student not found.</div>
  </div>
</template>

<script setup>
import QRCode from 'qrcode'

const route = useRoute()
const config = useRuntimeConfig()
const auth = useAuthStore()

const student = ref(null)
const loading = ref(true)
const qrCanvas = ref(null)
const expiryDate = ref('')

onMounted(async () => {
  try {
    const res = await $fetch(`${config.public.apiBase}/students/${route.params.id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    student.value = res

    if (res.Card?.expires_at) {
      expiryDate.value = new Date(res.Card.expires_at).toLocaleDateString()
    }

    await nextTick()
    if (qrCanvas.value && res.Card?.qr_token) {
      QRCode.toCanvas(qrCanvas.value, res.Card.qr_token, {
        width: 120,
        margin: 1,
        color: { dark: '#1e3a5f', light: '#ffffff' }
      })
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

const downloadCard = () => {
  window.print()
}
</script>