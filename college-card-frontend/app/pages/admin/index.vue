<template>
  <div>
    <h1 class="text-2xl font-bold text-eau-navy mb-6">Admin Dashboard</h1>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-xl shadow p-6 text-center">
        <p class="text-4xl font-bold text-eau-navy">{{ stats.total }}</p>
        <p class="text-gray-500 text-sm mt-1">Total Students</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6 text-center">
        <p class="text-4xl font-bold text-green-500">{{ stats.active }}</p>
        <p class="text-gray-500 text-sm mt-1">Active Cards</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6 text-center">
        <p class="text-4xl font-bold text-eau-gold">{{ stats.departments }}</p>
        <p class="text-gray-500 text-sm mt-1">Departments</p>
      </div>
      <div class="bg-white rounded-xl shadow p-6 text-center">
        <p class="text-4xl font-bold text-blue-500">{{ stats.graduated }}</p>
        <p class="text-gray-500 text-sm mt-1">Graduated</p>
      </div>
    </div>

    <!-- Students Table -->
    <div class="bg-white rounded-xl shadow overflow-hidden">
      <div class="px-6 py-4 border-b flex justify-between items-center flex-wrap gap-4">
        <h2 class="font-semibold text-gray-700">All Students</h2>
        <input v-model="search" placeholder="Search by name or ID..."
          class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-eau-navy w-64" />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th class="px-6 py-3 text-left">Student</th>
              <th class="px-6 py-3 text-left">ID</th>
              <th class="px-6 py-3 text-left">Department</th>
              <th class="px-6 py-3 text-left">Year</th>
              <th class="px-6 py-3 text-left">Status</th>
              <th class="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="s in filteredStudents" :key="s.id" class="hover:bg-gray-50">
              <td class="px-6 py-3 font-medium text-gray-800">{{ s.full_name }}</td>
              <td class="px-6 py-3 text-gray-500">{{ s.student_id }}</td>
              <td class="px-6 py-3 text-gray-500">{{ s.Department?.name }}</td>
              <td class="px-6 py-3 text-gray-500">Year {{ s.year }}</td>
              <td class="px-6 py-3">
                <span :class="{
                  'bg-green-100 text-green-700': s.status === 'active',
                  'bg-gray-100 text-gray-600': s.status === 'inactive',
                  'bg-blue-100 text-blue-700': s.status === 'graduated'
                }" class="px-2 py-0.5 rounded-full text-xs font-semibold capitalize">
                  {{ s.status }}
                </span>
              </td>
              <td class="px-6 py-3">
                <NuxtLink :to="`/card/${s.id}`" class="text-eau-navy hover:underline text-xs font-semibold">
                  View Card
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const config = useRuntimeConfig()
const search = ref('')
const students = ref([])

onMounted(async () => {
  const res = await $fetch(`${config.public.apiBase}/students`, {
    headers: { Authorization: `Bearer ${auth.token}` }
  })
  students.value = res
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
</script>
