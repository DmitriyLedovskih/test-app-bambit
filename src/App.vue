<template>
  <div class="max-w-[1100px] w-full mx-auto p-4 max-[520px]:p-0">
    <div
      class="min-h-screen bg-cyan-800 dark:bg-cyan-950 rounded-2xl transition-colors duration-200 max-[520px]:rounded-none">
      <div class="container mx-auto px-4 py-8">
        <header class="mb-8">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-white">
              Posts Manager
            </h1>
            <ThemeToggle />
          </div>
          <div class="flex gap-4 mb-6">
            <div class="flex-1">
              <input v-model="searchQuery" type="text" placeholder="Search by title..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white outline-none bg-cyan-700/50"
                @keyup.enter="handleSearch" />
            </div>
            <button @click="handleSearch" :disabled="postsStore.loading"
              class="px-6 py-2 bg-emerald-400 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 cursor-pointer">
              <LoadingSpinner v-if="postsStore.loading" class="w-4 h-4" />
              Search
            </button>
          </div>
        </header>
      </div>
      <Table />
    </div>
    <UserCard v-if="usersStore.selectedUser" :user="usersStore.selectedUser" @close="usersStore.selectUser(null)" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useUsersStore } from '@/stores/users'
import UserCard from '@/components/UserCard.vue'
import Table from '@/components/Table.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import ThemeToggle from './components/ThemeToggle.vue'

const postsStore = usePostsStore()
const usersStore = useUsersStore()
const searchQuery = ref('')

onMounted(async () => {
  await Promise.all([
    postsStore.fetchPosts(),
    usersStore.fetchUsers()
  ])
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    postsStore.searchPosts(searchQuery.value.trim())
  } else {
    postsStore.fetchPosts()
  }
}


watch(searchQuery, (newQuery) => {
  if (!newQuery.trim()) {
    postsStore.fetchPosts()
  }
})
</script>
