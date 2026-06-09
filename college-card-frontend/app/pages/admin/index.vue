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
        <p class="text-sm text-gray-500 mt-0.5">Manage all student digital cards</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div
          class="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition hover:-translate-y-0.5">
          <div class="flex items-center justify-center w-12 h-12 text-2xl rounded-full bg-blue-50">👥</div>
          <div>
            <p class="text-2xl font-bold" style="color: #1a3a5c;">{{ students.length }}</p>
            <p class="text-xs text-gray-500">Total Students</p>
          </div>
        </div>
        <div
          class="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition hover:-translate-y-0.5">
          <div class="flex items-center justify-center w-12 h-12 text-2xl rounded-full bg-green-50">✅</div>
          <div>
            <p class="text-2xl font-bold text-green-600">{{ activeCount }}</p>
            <p class="text-xs text-gray-500">Active Cards</p>
          </div>
        </div>
        <div
          class="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition hover:-translate-y-0.5">
          <div class="flex items-center justify-center w-12 h-12 text-2xl rounded-full bg-yellow-50">🏛</div>
          <div>
            <p class="text-2xl font-bold text-yellow-600">{{ deptCount }}</p>
            <p class="text-xs text-gray-500">Departments</p>
          </div>
        </div>
        <div
          class="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition hover:-translate-y-0.5">
          <div class="flex items-center justify-center w-12 h-12 text-2xl rounded-full bg-blue-50">🎓</div>
          <div>
            <p class="text-2xl font-bold text-blue-600">{{ graduatedCount }}</p>
            <p class="text-xs text-gray-500">Graduated</p>
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
                class="w-64 py-2 pr-4 text-sm border border-gray-200 rounded-lg pl-9 focus:outline-none focus:ring-2" />
            </div>
            <NuxtLink to="/admin/students"
              class="px-4 py-2 text-xs font-semibold transition rounded-lg hover:opacity-90"
              style="background: #c8a84b; color: #1a3a5c;">
              Manage Students
            </NuxtLink>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="tableLoading" class="py-16 text-center">
          <div class="w-8 h-8 mx-auto mb-3 border-4 rounded-full animate-spin"
            style="border-color: #1a3a5c; border-top-color: transparent;"></div>
          <p class="text-sm text-gray-400">Loading students...</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead style="background: #f8f9fa;">
              <tr class="text-xs text-gray-500 uppercase">
                <th class="px-6 py-4 text-left">Student</th>
                <th class="px-6 py-4 text-left">ID</th>
                <th class="px-6 py-4 text-left">Department</th>
                <th class="px-6 py-4 text-left">Year</th>
                <th class="px-6 py-4 text-left">Status</th>
                <th class="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="s in filteredStudents" :key="s.id" class="transition-colors hover:bg-gray-50">
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
                  <div class="flex items-center gap-3">
                    <NuxtLink :to="`/card/${s.id}`" class="text-xs font-semibold hover:underline"
                      style="color: #1a3a5c;">
                      View Card →
                    </NuxtLink>
                    <label :for="`photo-${s.id}`"
                      class="px-2 py-1 text-xs font-semibold transition border rounded cursor-pointer hover:opacity-80"
                      style="color: #1a3a5c; border-color: #1a3a5c;">
                      Upload Photo
                    </label>
                    <input :id="`photo-${s.id}`" type="file" accept="image/*" class="hidden"
                      @change="uploadPhoto(s.id, $event)" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty state -->
          <div v-if="filteredStudents.length === 0" class="py-16 text-center text-gray-400">
            <p class="mb-3 text-4xl">🎓</p>
            <p class="font-medium">No students found</p>
            <p class="mt-1 text-sm">Try a different search term</p>
          </div>
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
const router = useRouter()
const search = ref('')
const students = ref([])
const tableLoading = ref(true)

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
    const res = await $fetch('http://localhost:5000/api/students', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    students.value = res
  } catch (err) {
    console.error('Failed to load students:', err)
  } finally {
    tableLoading.value = false
  }
})

const filteredStudents = computed(() => {
  if (!search.value) return students.value
  const q = search.value.toLowerCase()
  return students.value.filter(s =>
    s.full_name?.toLowerCase().includes(q) ||
    s.student_id?.toLowerCase().includes(q)
  )
})

const activeCount = computed(() => students.value.filter(s => s.status === 'active').length)
const graduatedCount = computed(() => students.value.filter(s => s.status === 'graduated').length)
const deptCount = computed(() => [...new Set(students.value.map(s => s.Department?.name))].length)

const uploadPhoto = async (studentId, event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('photo', file)

  try {
    const res = await $fetch(`http://localhost:5000/api/upload/${studentId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: formData
    })
    const student = students.value.find(s => s.id === studentId)
    if (student) student.photo_url = res.photo_url
    alert('Photo uploaded!')
  } catch (err) {
    console.error('Upload failed:', err)
    alert('Upload failed')
  }
}

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>