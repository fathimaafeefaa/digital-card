<template>
  <div class="space-y-6">
    <!-- Controls -->
    <div class="flex flex-wrap items-center justify-between gap-4 p-4 bg-white shadow rounded-xl">
      <div class="flex items-center gap-4">
        <div class="relative">
          <span class="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2">🔍</span>
          <input
            v-model="search"
            placeholder="Search by name or ID..."
            class="w-64 py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eau-navy"
          />
        </div>
        <select
          v-model="departmentFilter"
          class="px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-eau-navy"
        >
          <option value="">All Departments</option>
          <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="viewMode = 'grid'"
          class="p-2 transition-colors rounded-lg"
          :class="viewMode === 'grid' ? 'bg-eau-navy text-white' : 'bg-gray-100 hover:bg-gray-200'"
        >
          📱
        </button>
        <button
          @click="viewMode = 'list'"
          class="p-2 transition-colors rounded-lg"
          :class="viewMode === 'list' ? 'bg-eau-navy text-white' : 'bg-gray-100 hover:bg-gray-200'"
        >
          📋
        </button>
      </div>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="overflow-hidden bg-white shadow rounded-xl">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50">
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
            <tr
              v-for="s in filteredStudents"
              :key="s.id"
              class="transition-colors duration-150 hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-10 h-10 font-bold rounded-full bg-eau-navy text-eau-gold">
                    {{ s.full_name.charAt(0) }}
                  </div>
                  <span class="font-medium text-gray-800">{{ s.full_name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-500">{{ s.student_id }}</td>
              <td class="px-6 py-4 text-gray-500">{{ s.Department?.name }}</td>
              <td class="px-6 py-4 text-gray-500">Year {{ s.year }}</td>
              <td class="px-6 py-4">
                <span :class="{
                  'bg-green-100 text-green-700': s.status === 'active',
                  'bg-gray-100 text-gray-600': s.status === 'inactive',
                  'bg-blue-100 text-blue-700': s.status === 'graduated'
                }" class="px-3 py-1 text-xs font-semibold capitalize rounded-full">
                  {{ s.status }}
                </span>
              </td>
              <td class="flex gap-3 px-6 py-4">
                <NuxtLink
                  :to="`/card/${s.id}`"
                  class="text-sm font-semibold text-eau-navy hover:underline"
                >
                  View Card
                </NuxtLink>
                <button
                  @click="confirmDelete(s)"
                  class="text-sm font-semibold text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="s in filteredStudents"
        :key="s.id"
        class="p-6 transition-all duration-300 bg-white shadow rounded-xl hover:shadow-md hover:-translate-y-1"
      >
        <div class="flex items-center gap-4 mb-4">
          <div class="flex items-center justify-center w-12 h-12 text-lg font-bold rounded-full bg-eau-navy text-eau-gold">
            {{ s.full_name.charAt(0) }}
          </div>
          <div>
            <h3 class="font-semibold text-gray-800">{{ s.full_name }}</h3>
            <p class="text-xs text-gray-500">{{ s.student_id }}</p>
          </div>
        </div>
        <div class="mb-4 space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Department</span>
            <span class="text-gray-800">{{ s.Department?.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Year</span>
            <span class="text-gray-800">Year {{ s.year }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-500">Status</span>
            <span :class="{
              'bg-green-100 text-green-700': s.status === 'active',
              'bg-gray-100 text-gray-600': s.status === 'inactive',
              'bg-blue-100 text-blue-700': s.status === 'graduated'
            }" class="px-2 py-0.5 rounded-full text-xs font-semibold capitalize">
              {{ s.status }}
            </span>
          </div>
        </div>
        <div class="flex gap-2">
          <NuxtLink
            :to="`/card/${s.id}`"
            class="flex-1 py-2 text-sm font-semibold text-center text-white transition rounded-lg bg-eau-navy hover:opacity-90"
          >
            View Card
          </NuxtLink>
          <button
            @click="confirmDelete(s)"
            class="px-4 py-2 text-sm font-semibold text-red-500 transition border border-red-200 rounded-lg hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showDeleteModal = false">
      <div class="w-full max-w-md p-6 mx-4 bg-white shadow-2xl rounded-xl animate-fade-in-up">
        <h3 class="mb-2 text-xl font-bold text-gray-800">Delete Student</h3>
        <p class="mb-6 text-gray-600">
          Are you sure you want to delete <strong>{{ studentToDelete?.full_name }}</strong>? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 font-semibold text-gray-700 transition border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="deleteStudent"
            :disabled="deleting"
            class="px-4 py-2 font-semibold text-white transition bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

definePageMeta({
    middleware: 'admin'
})

import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const config = useRuntimeConfig()
const search = ref('')
const departmentFilter = ref('')
const students = ref([])
const viewMode = ref('grid')
const showDeleteModal = ref(false)
const studentToDelete = ref(null)
const deleting = ref(false)

onMounted(async () => {
  await loadStudents()
})

const departments = computed(() => {
  const depts = [...new Set(students.value.map(s => s.Department?.name).filter(Boolean))]
  return depts
})

const filteredStudents = computed(() => {
  let result = students.value
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(s =>
      s.full_name.toLowerCase().includes(q) ||
      s.student_id.toLowerCase().includes(q)
    )
  }
  if (departmentFilter.value) {
    result = result.filter(s => s.Department?.name === departmentFilter.value)
  }
  return result
})

const loadStudents = async () => {
  const res = await $fetch(`${config.public.apiBase}/students`, {
    headers: { Authorization: `Bearer ${auth.token}` }
  })
  students.value = res
}

const confirmDelete = (student) => {
  studentToDelete.value = student
  showDeleteModal.value = true
}

const deleteStudent = async () => {
  if (!studentToDelete.value) return
  deleting.value = true
  try {
    await $fetch(`${config.public.apiBase}/students/${studentToDelete.value.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    await loadStudents()
    showDeleteModal.value = false
  } catch (err) {
    console.error(err)
    alert('Failed to delete student')
  } finally {
    deleting.value = false
    studentToDelete.value = null
  }
}
</script>
