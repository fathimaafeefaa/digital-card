<template>
  <div class="space-y-6">
    <!-- Controls -->
    <div class="bg-white rounded-xl shadow p-4 flex flex-wrap gap-4 items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            v-model="search"
            placeholder="Search by name or ID..."
            class="border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eau-navy w-64"
          />
        </div>
        <select
          v-model="departmentFilter"
          class="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-eau-navy"
        >
          <option value="">All Departments</option>
          <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="viewMode = 'grid'"
          class="p-2 rounded-lg transition-colors"
          :class="viewMode === 'grid' ? 'bg-eau-navy text-white' : 'bg-gray-100 hover:bg-gray-200'"
        >
          📱
        </button>
        <button
          @click="viewMode = 'list'"
          class="p-2 rounded-lg transition-colors"
          :class="viewMode === 'list' ? 'bg-eau-navy text-white' : 'bg-gray-100 hover:bg-gray-200'"
        >
          📋
        </button>
      </div>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="bg-white rounded-xl shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
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
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-eau-navy flex items-center justify-center text-eau-gold font-bold">
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
                }" class="px-3 py-1 rounded-full text-xs font-semibold capitalize">
                  {{ s.status }}
                </span>
              </td>
              <td class="px-6 py-4 flex gap-3">
                <NuxtLink
                  :to="`/card/${s.id}`"
                  class="text-eau-navy hover:underline text-sm font-semibold"
                >
                  View Card
                </NuxtLink>
                <button
                  @click="confirmDelete(s)"
                  class="text-red-500 hover:underline text-sm font-semibold"
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
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="s in filteredStudents"
        :key="s.id"
        class="bg-white rounded-xl shadow p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
      >
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-eau-navy flex items-center justify-center text-eau-gold font-bold text-lg">
            {{ s.full_name.charAt(0) }}
          </div>
          <div>
            <h3 class="font-semibold text-gray-800">{{ s.full_name }}</h3>
            <p class="text-gray-500 text-xs">{{ s.student_id }}</p>
          </div>
        </div>
        <div class="space-y-2 mb-4 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Department</span>
            <span class="text-gray-800">{{ s.Department?.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Year</span>
            <span class="text-gray-800">Year {{ s.year }}</span>
          </div>
          <div class="flex justify-between items-center">
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
            class="flex-1 bg-eau-navy text-white text-center py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
          >
            View Card
          </NuxtLink>
          <button
            @click="confirmDelete(s)"
            class="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showDeleteModal = false">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 mx-4 animate-fade-in-up">
        <h3 class="text-xl font-bold text-gray-800 mb-2">Delete Student</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{{ studentToDelete?.full_name }}</strong>? This action cannot be undone.
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            @click="deleteStudent"
            :disabled="deleting"
            class="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
