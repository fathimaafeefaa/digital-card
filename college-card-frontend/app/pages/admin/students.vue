<template>
    <div>
        <h1 class="mb-6 text-2xl font-bold">Manage Students</h1>
        <div class="p-4 mb-6 bg-white shadow rounded-xl">
            <input v-model="search" placeholder="Search students..."
                class="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none" />
        </div>
        <div class="overflow-hidden bg-white shadow rounded-xl">
            <table class="w-full text-sm">
                <thead class="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left">Name</th>
                        <th class="px-6 py-3 text-left">Student ID</th>
                        <th class="px-6 py-3 text-left">Department</th>
                        <th class="px-6 py-3 text-left">Year</th>
                        <th class="px-6 py-3 text-left">Status</th>
                        <th class="px-6 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-for="s in filteredStudents" :key="s.id" class="hover:bg-gray-50">
                        <td class="px-6 py-3 font-medium">{{ s.full_name }}</td>
                        <td class="px-6 py-3 text-gray-500">{{ s.student_id }}</td>
                        <td class="px-6 py-3 text-gray-500">{{ s.Department?.name }}</td>
                        <td class="px-6 py-3 text-gray-500">Year {{ s.year }}</td>
                        <td class="px-6 py-3">
                            <span class="px-2 py-0.5 rounded-full text-xs font-semibold capitalize" :class="{
                                'bg-green-100 text-green-700': s.status === 'active',
                                'bg-gray-100 text-gray-600': s.status === 'inactive',
                                'bg-blue-100 text-blue-700': s.status === 'graduated'
                            }">
                                {{ s.status }}
                            </span>
                        </td>
                        <td class="px-6 py-3">
                            <NuxtLink :to="`/card/${s.id}`"
                                class="mr-3 text-xs font-semibold text-blue-600 hover:underline">
                                View Card
                            </NuxtLink>
                            <button @click="deleteStudent(s.id)"
                                class="text-xs font-semibold text-red-500 hover:underline">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
const auth = useAuthStore()
const config = useRuntimeConfig()
const search = ref('')
const students = ref([])

onMounted(async () => {
    students.value = await $fetch(`${config.public.apiBase}/students`, {
        headers: { Authorization: `Bearer ${auth.token}` }
    })
})

const filteredStudents = computed(() => {
    if (!search.value) return students.value
    const q = search.value.toLowerCase()
    return students.value.filter(s =>
        s.full_name.toLowerCase().includes(q) ||
        s.student_id.toLowerCase().includes(q)
    )
})

const deleteStudent = async (id) => {
    if (!confirm('Delete this student?')) return
    await $fetch(`${config.public.apiBase}/students/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` }
    })
    students.value = students.value.filter(s => s.id !== id)
}
</script>