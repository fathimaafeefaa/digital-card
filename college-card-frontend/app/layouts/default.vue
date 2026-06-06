<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="flex items-center justify-between px-6 py-4 text-white shadow bg-primary">
      <div class="flex items-center gap-3">
        <img src="/logo.png" alt="College" class="object-contain w-8 h-8" onerror="this.style.display='none'" />
        <span class="text-lg font-bold">College Digital Card</span>
      </div>
      <div class="flex items-center gap-4">
        <span v-if="auth.user" class="text-sm text-gray-300">{{ auth.user.email }}</span>
        <NuxtLink v-if="auth.isAdmin" to="/admin" class="text-sm transition hover:text-accent">Admin Panel</NuxtLink>
        <button v-if="auth.isLoggedIn" @click="logout"
          class="text-sm bg-accent text-primary font-semibold px-4 py-1.5 rounded hover:opacity-90 transition">
          Logout
        </button>
      </div>
    </nav>
    <main class="container px-4 py-8 mx-auto">
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