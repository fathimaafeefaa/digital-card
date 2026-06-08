<template>
  <div class="min-h-screen bg-eau-light flex">
    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed md:static inset-y-0 left-0 z-50 bg-eau-navy text-white w-64 transform transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <div class="p-6 flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-eau-gold flex items-center justify-center">
          <span class="text-eau-navy font-bold text-lg">EAU</span>
        </div>
        <span class="font-bold text-lg">EAU Portal</span>
      </div>

      <nav class="mt-4">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-6 py-3 transition-all duration-200 hover:bg-eau-navy/80"
          :class="{
            'border-l-4 border-eau-gold text-eau-gold bg-eau-navy/80': isActiveRoute(item.to),
            'border-l-4 border-transparent text-gray-300': !isActiveRoute(item.to)
          }"
        >
          <span class="text-xl">{{ item.icon }}</span>
          <span class="font-medium">{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Bar -->
      <header class="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <span class="text-xl">☰</span>
          </button>
          <h1 class="text-xl font-bold text-eau-navy">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center gap-4">
          <span v-if="auth.user" class="text-sm text-gray-600">{{ auth.user.email }}</span>
          <button
            v-if="auth.isLoggedIn"
            @click="logout"
            class="text-sm bg-eau-navy text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const sidebarOpen = ref(false)

const navItems = computed(() => [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/students', label: 'Students', icon: '👥' },
  { to: '/admin/cards', label: 'Cards', icon: '🎴' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' }
])

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/admin') return 'Dashboard'
  if (path === '/admin/students') return 'Manage Students'
  if (path.startsWith('/card/')) return 'Student Card'
  return 'EAU Portal'
})

const isActiveRoute = (to) => {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>
