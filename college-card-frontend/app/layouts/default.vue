<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-primary text-white px-6 py-4 flex justify-between items-center shadow">
      <div class="flex items-center gap-3">
        <img src="/logo.png" alt="College" class="h-8 w-8 object-contain" onerror="this.style.display='none'"/>
        <span class="font-bold text-lg">College Digital Card</span>
      </div>
      <div class="flex items-center gap-4">
        <span v-if="auth.user" class="text-sm text-gray-300">{{ auth.user.email }}</span>
        <NuxtLink v-if="auth.isAdmin" to="/admin" class="text-sm hover:text-accent transition">Admin Panel</NuxtLink>
        <button
          v-if="auth.isLoggedIn"
          @click="logout"
          class="text-sm bg-accent text-primary font-semibold px-4 py-1.5 rounded hover:opacity-90 transition"
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
