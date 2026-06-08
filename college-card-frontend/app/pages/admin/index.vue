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
        <span class="text-xs px-2 py-0.5 rounded-full ml-2" style="background: rgba(200,168,75,0.2); color: #c8a84b;">
          Admin Panel
        </span>
      </div>
      <div class="flex items-center gap-4">
        <span class="hidden text-xs sm:block" style="color: rgba(255,255,255,0.6);">
          {{ auth.user?.email }}
        </span>
        <button @click="logout" class="text-xs font-semibold px-4 py-1.5 rounded-lg transition hover:opacity-90"
          style="background: #c8a84b; color: #1a3a5c;">
          Logout
        </button>
      </div>
    </nav>

    <!-- Page Content -->
    <div class="p-6 space-y-6">

      <!-- Page Title -->
      <div>
        <h1 class="text-2xl font-bold" style="color: #1a3a5c;">Admin Dashboard</h1>
        <p class="text-gray-500 text-sm mt-0.5">Manage all student digital cards</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(stat, index) in statsArray" :key="stat.label"
          class="p-6 transition-all duration-300 bg-white shadow rounded-xl hover:shadow-md hover:-translate-y-1"
          :style="`opacity: 0; animation: fadeInUp 0.4s ease forwards; animation-delay: ${index * 100}ms;`">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-12 h-12 text-2xl rounded-full" :class="stat.bgColor">
              {{ stat.icon }}
            </div>
            <div>
              <p class="text-3xl font-bold" :class="stat.textColor">{{ stat.value }}</p>
              <p class="mt-1 text-sm text-gray-500">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Students Table -->
      <div class="overflow-hidden bg-white shadow rounded-xl">
        <div class="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b">
          <h2 class="text-lg font-semibold text-gray-700">All Students</h2>
          <div class="flex items-center gap-3">
            <div class="relative">
              <span class="absolute text-sm text-gray-400 -translate-y-1/2 left-3 top-1/2">🔍</span>
              <input v-model="search" placeholder="Search by name or ID..."
                class="w-64 py-2 pr-4 text-sm border border-gray-200 rounded-lg pl-9 focus:outline-none focus:ring-2"
                style="focus:ring-color: #1a3a5c;" />
            </div>
            <NuxtLink to="/admin/students"
              class="px-4 py-2 text-xs font-semibold transition rounded-lg hover:opacity-90"
              style="background: #c8a84b; color: #1a3a5c;">
              Manage Students
            </NuxtLink>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="text-xs text-gray-500 uppercase" style="background: #f8f9fa;">
              <tr>
                <th class="px-6 py-4 text-left">Student</th>
                <th class="px-6 py-4 text-left">ID</th>
                <th class="px-6 py-4 text-left">Department</th>
                <th class="px-6 py-4 text-left">Year</th>
                <th class="px-6 py-4 text-left">Status</th>
                <th class="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(s, index) in filteredStudents" :key="s.id"
                class="transition-colors duration-150 hover:bg-gray-50"
                :style="`opacity: 0; animation: fadeInUp 0.4s ease forwards; animation-delay: ${400 + index * 50}ms;`">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center flex-shrink-0 w-10 h-10 text-sm font-bold rounded-full"
                      style="background: #1a3a5c; color: #c8a84b;">
                      {{ s.full_name?.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-800">{{ s.full_name }}</p>
                      <p class="text-xs text-gray-400">{{ s.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 font-mono text-xs text-gray-500">{{ s.student_id }}</td>
                <td class="px-6 py-4 text-gray-500">{{ s.Department?.name }}</td>
                <td class="px-6 py-4 text-gray-500">Year {{ s.year }}</td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 text-xs font-semibold capitalize rounded-full" :class="{
                    'bg-green-100 text-green-700': s.status === 'active',
                    'bg-gray-100 text-gray-600': s.status === 'inactive',
                    'bg-blue-100 text-blue-700': s.status === 'graduated'
                  }">
                    {{ s.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <NuxtLink :to="`/card/${s.id}`" class="text-sm font-semibold hover:underline" style="color: #1a3a5c;">
                    View Card →
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div v-if="filteredStudents.length === 0" class="py-16 text-center text-gray-400">
          <p class="mb-3 text-4xl">🎓</p>
          <p class="font-medium">No students found</p>
          <p class="mt-1 text-sm">Try a different search term</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const config = useRuntimeConfig()
const router = useRouter()
const search = ref('')
const students = ref([])

onMounted(async () => {
  auth.loadFromStorage()

  await nextTick()

  if (!auth.token) {
    router.push('/')
    return
  }

  if (auth.user?.role !== 'admin') {
    router.push('/')
    return
  }

  try {
    const res = await $fetch(`${config.public.apiBase}/students`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    students.value = res
  } catch (err) {
    console.error(err)
  }
})

const filteredStudents = computed(() => {
  if (!search.value) return students.value
  const q = search.value.toLowerCase()
  return students.value.filter(s =>
    s.full_name.toLowerCase().includes(q) ||
    s.student_id.toLowerCase().includes(q)
  )
})

const stats = computed(() => ({
  total: students.value.length,
  active: students.value.filter(s => s.status === 'active').length,
  graduated: students.value.filter(s => s.status === 'graduated').length,
  departments: [...new Set(students.value.map(s => s.Department?.name))].length
}))

const statsArray = computed(() => [
  { icon: '👥', label: 'Total Students', value: stats.value.total, textColor: 'text-eau-navy', bgColor: 'bg-blue-50' },
  { icon: '✅', label: 'Active Cards', value: stats.value.active, textColor: 'text-green-600', bgColor: 'bg-green-100' },
  { icon: '🎓', label: 'Graduated', value: stats.value.graduated, textColor: 'text-blue-600', bgColor: 'bg-blue-100' },
  { icon: '🏛', label: 'Departments', value: stats.value.departments, textColor: 'text-yellow-600', bgColor: 'bg-yellow-50' }
])

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>