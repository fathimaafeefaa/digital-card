<template>
  <div class="min-h-screen" style="background: #f0f4f8;">

    <!-- Navbar -->
    <nav class="flex items-center justify-between px-6 py-4 shadow-sm" style="background: #1a3a5c;">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center text-xs font-black rounded-full w-9 h-9"
          style="background: #c8a84b; color: #1a3a5c;">
          EAU
        </div>
        <span class="text-sm font-semibold text-white">Emirates Aviation University</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="hidden text-xs sm:block" style="color: rgba(255,255,255,0.6);">{{ auth.user?.email }}</span>
        <button @click="logout" class="text-xs font-semibold px-4 py-1.5 rounded-lg transition hover:opacity-90"
          style="background: #c8a84b; color: #1a3a5c;">
          Logout
        </button>
      </div>
    </nav>

    <!-- Content -->
    <div class="flex justify-center px-4 py-8">
      <div v-if="loading" class="mt-20 text-center">
        <div class="w-10 h-10 mx-auto mb-4 border-4 rounded-full border-t-transparent animate-spin"
          style="border-color: #1a3a5c; border-top-color: transparent;"></div>
        <p class="text-sm text-gray-500">Loading your card...</p>
      </div>

      <div v-else-if="student" class="w-full max-w-sm">

        <!-- Digital Card -->
        <div class="relative overflow-hidden shadow-2xl rounded-2xl"
          style="background: #1a3a5c; animation: cardFlip 0.6s ease forwards;" @mouseenter="isHovered = true"
          @mouseleave="isHovered = false">

          <!-- Watermark -->
          <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div class="font-bold text-white uppercase whitespace-nowrap"
              style="opacity:0.04; font-size:1.8rem; transform: rotate(-25deg) translateY(60%) translateX(-10%);">
              EMIRATES AVIATION UNIVERSITY EMIRATES AVIATION UNIVERSITY
            </div>
          </div>

          <!-- Shimmer on hover -->
          <div v-if="isHovered" class="absolute inset-0 z-10 pointer-events-none"
            style="background: linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0) 100%); transition: opacity 0.3s;">
          </div>

          <!-- Top Banner -->
          <div class="relative z-10 flex items-center justify-between px-6 py-3" style="background: #c8a84b;">
            <span class="text-sm font-bold" style="color: #1a3a5c;">EMIRATES AVIATION UNIVERSITY</span>
            <span class="text-xs font-semibold" style="color: #1a3a5c;">STUDENT ID CARD</span>
          </div>

          <!-- Card Body -->
          <div class="relative z-10 px-6 py-6">

            <!-- Photo -->
            <div class="flex justify-center mb-4">
              <div class="flex items-center justify-center overflow-hidden border-4 rounded-full w-28 h-28"
                style="border-color: #c8a84b; background: linear-gradient(135deg, #1e4a7c, #2a5a8c);">
                <img v-if="student.photo_url" :src="student.photo_url" class="object-cover w-full h-full" />
                <span v-else class="text-5xl font-bold text-white">
                  {{ student.full_name?.charAt(0) }}
                </span>
              </div>
            </div>

            <!-- Name -->
            <div class="mb-6 text-center">
              <h2 class="text-xl font-bold text-white">{{ student.full_name }}</h2>
              <p class="text-sm font-semibold mt-0.5" style="color: #c8a84b;">
                {{ student.Department?.name }}
              </p>
            </div>

            <!-- Details -->
            <div class="mb-6 space-y-2">
              <div v-for="(detail, index) in cardDetails" :key="detail.label" class="flex justify-between"
                :style="`opacity: 0; animation: fadeInUp 0.4s ease forwards; animation-delay: ${300 + index * 80}ms;`">
                <span class="text-xs" style="color: rgba(255,255,255,0.5);">{{ detail.label }}</span>
                <span class="text-xs font-semibold"
                  :style="detail.label === 'Status' ? 'color: #4ade80;' : 'color: white;'">
                  {{ detail.value }}
                </span>
              </div>
            </div>

            <!-- QR Code -->
            <div class="relative flex justify-center p-3 bg-white rounded-xl"
              style="box-shadow: 0 0 0 2px rgba(200,168,75,0.6);">
              <img v-if="qrDataUrl" :src="qrDataUrl" width="140" height="140" alt="QR Code" />
              <div v-else class="flex items-center justify-center text-xs text-gray-300 w-36 h-36">
                Generating...
              </div>
            </div>
            <p class="mt-2 text-xs text-center" style="color: rgba(255,255,255,0.4);">
              Scan to verify identity
            </p>

          </div>

          <!-- Footer -->
          <div class="relative z-10 flex items-center justify-between px-6 py-3" style="background: #c8a84b;">
            <span class="text-xs font-semibold" style="color: #1a3a5c;">
              Valid Until: {{ expiryDate }}
            </span>
            <span class="font-mono text-xs font-semibold" style="color: #1a3a5c;">
              {{ formattedCardNumber }}
            </span>
          </div>

        </div>

        <!-- Download Button -->
        <button @click="downloadCard" class="w-full py-3 mt-6 font-semibold transition rounded-lg hover:opacity-90"
          style="background: #c8a84b; color: #1a3a5c;">
          Download Card
        </button>

      </div>

      <!-- Not found -->
      <div v-else class="mt-20 text-center">
        <p class="font-semibold text-red-500">Student not found.</p>
        <NuxtLink to="/" class="block mt-3 text-sm underline" style="color: #1a3a5c;">
          Back to Login
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>

definePageMeta({
  middleware: 'auth'
})

import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const auth = useAuthStore()

const student = ref(null)
const loading = ref(true)
const qrDataUrl = ref('')
const expiryDate = ref('')
const isHovered = ref(false)

const cardDetails = computed(() => {
  if (!student.value) return []
  return [
    { label: 'Student ID', value: student.value.student_id },
    { label: 'Year of Study', value: `Year ${student.value.year}` },
    { label: 'Faculty', value: student.value.Department?.faculty },
    { label: 'Email', value: student.value.email },
    { label: 'Phone', value: student.value.phone || 'N/A' },
    { label: 'Status', value: student.value.status?.toUpperCase() }
  ]
})

const formattedCardNumber = computed(() => {
  if (!student.value?.Card?.qr_token) return '•••• •••• •••• ••••'
  const last8 = student.value.Card.qr_token.slice(-8).toUpperCase()
  return `•••• •••• ${last8.slice(0, 4)} ${last8.slice(4)}`
})

onMounted(async () => {
  auth.loadFromStorage()

  if (!auth.token) {
    navigateTo('/')
    return
  }

  try {
    const res = await $fetch(`http://localhost:5000/api/students/${route.params.id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    student.value = res

    if (res.Card?.expires_at) {
      expiryDate.value = new Date(res.Card.expires_at).toLocaleDateString()
    }

    if (res.Card?.qr_token) {
      const QRCode = await import('qrcode')
      qrDataUrl.value = await QRCode.default.toDataURL(
        `http://localhost:5000/api/cards/scan/${res.Card.qr_token}`,
        {
          width: 150,
          margin: 1,
          color: { dark: '#1a3a5c', light: '#ffffff' }
        }
      )
    }

  } catch (err) {
    console.error('Card error:', err)
  } finally {
    loading.value = false
  }
})

const logout = () => {
  auth.logout()
  navigateTo('/')
}

const downloadCard = () => {
  window.print()
}
</script>

<style scoped>
@keyframes cardFlip {
  from {
    opacity: 0;
    transform: rotateY(15deg) translateY(20px);
  }

  to {
    opacity: 1;
    transform: rotateY(0deg) translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>