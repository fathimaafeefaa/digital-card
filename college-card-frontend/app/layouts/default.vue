<template>
  <div class="min-h-screen bg-eau-light">
    <nav class="bg-eau-navy text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-eau-gold flex items-center justify-center">
          <span class="text-eau-navy font-bold text-lg">EAU</span>
        </div>
        <span class="font-bold text-lg">Emirates Aviation University</span>
      </div>
      <div class="flex items-center gap-4">
        <span v-if="auth.user" class="text-sm text-gray-300">{{ auth.user.email }}</span>
        <NuxtLink v-if="auth.isAdmin" to="/admin" class="text-sm hover:text-eau-gold transition">Admin Panel</NuxtLink>
        <button
          v-if="auth.isLoggedIn"
          @click="logout"
          class="text-sm bg-eau-gold text-eau-navy font-semibold px-4 py-1.5 rounded hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>
    </nav>
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>
