<template>
  <div class="flex justify-center">
    <div v-if="loading" class="text-gray-500 mt-20">Loading card...</div>

    <div v-else-if="student" class="w-full max-w-sm">

      <!-- Card Front -->
      <div class="bg-primary rounded-2xl shadow-2xl overflow-hidden">

        <!-- Top banner -->
        <div class="bg-accent px-6 py-3 flex justify-between items-center">
          <span class="text-primary font-bold text-sm">COLLEGE NAME</span>
          <span class="text-primary text-xs font-semibold">STUDENT ID CARD</span>
        </div>

        <!-- Card body -->
        <div class="px-6 py-6">
          <!-- Photo -->
          <div class="flex justify-center mb-4">
            <div class="w-24 h-24 rounded-full border-4 border-accent overflow-hidden bg-gray-200 flex items-center justify-center">
              <img
                v-if="student.photo_url"
                :src="student.photo_url"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-4xl text-gray-400 font-bold">
                {{ student.full_name?.charAt(0) }}
              </span>
            </div>
          </div>

          <!-- Name -->
          <div class="text-center mb-6">
            <h2 class="text-white text-xl font-bold">{{ student.full_name }}</h2>
            <p class="text-accent text-sm font-semibold mt-0.5">{{ student.Department?.name }}</p>
          </div>

          <!-- Details -->
          <div class="space-y-2 mb-6">
            <div class="flex justify-between">
              <span class="text-gray-400 text-xs">Student ID</span>
              <span class="text-white text-xs font-semibold">{{ student.student_id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400 text-xs">Year</span>
              <span class="text-white text-xs font-semibold">Year {{ student.year }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400 text-xs">Faculty</span>
              <span class="text-white text-xs font-semibold">{{ student.Department?.faculty }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400 text-xs">Email</span>
              <span class="text-white text-xs font-semibold">{{ student.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400 text-xs">Status</span>
              <span class="text-green-400 text-xs font-semibold uppercase">{{ student.status }}</span>
            </div>
          </div>

          <!-- QR Code -->
          <div class="flex justify-center bg-white rounded-xl p-3">
            <canvas ref="qrCanvas"></canvas>
          </div>
          <p class="text-center text-gray-400 text-xs mt-2">Scan to verify identity</p>

        </div>

        <!-- Bottom -->
        <div class="bg-accent px-6 py-2 text-center">
          <span class="text-primary text-xs font-semibold">
            Valid Until: {{ expiryDate }}
          </span>
        </div>

      </div>

      <!-- Download button -->
      <button
        @click="downloadCard"
        class="w-full mt-4 bg-accent text-primary font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
      >
        Download Card
      </button>

    </div>

    <div v-else class="text-red-500 mt-20">Student not found.</div>
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
