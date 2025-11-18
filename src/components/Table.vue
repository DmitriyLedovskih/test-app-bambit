<template>
  <div class="overflow-hidden">
    <div ref="tableContainer" class="overflow-auto max-w-[600px] max-h-[600px] mx-auto" @scroll="handleScroll">
      <table class="w-full min-w-full">
        <thead class="bg-emerald-600 sticky top-0 z-10">
          <tr>
            <th v-for="column in columns" :key="column.key" @click="handleSort(column.key)"
              class="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-emerald-950 transition-colors duration-200">
              <div class="flex items-center gap-1">
                <span>{{ column.label }}</span>
                <div v-if="sortField === column.key" class="flex flex-col">
                  <span class="text-xs text-white" v-if="sortDirection === 'asc'">
                    <BiSolidUpArrowAlt class="w-3.5 h-3.5" />
                  </span>
                  <span class="text-xs text-white" v-if="sortDirection === 'desc'">
                    <BiSolidDownArrowAlt class="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-emerald-900 divide-y divide-neutral-400">
          <template v-if="postsStore.loading && postsStore.paginatedPosts.length === 0">
            <tr v-for="i in 10" :key="i">
              <td v-for="column in columns" :key="column.key" class="px-4 py-3">
                <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
              </td>
            </tr>
          </template>
          <tr v-for="post in postsStore.paginatedPosts" :key="post.id"
            class="hover:bg-emerald-950 transition-colors duration-200">
            <td class="px-4 py-3 text-sm text-white">
              {{ post.id }}
            </td>
            <td class="px-4 py-3 text-sm">
              <div class="text-white truncate max-w-[150px]" :title="post.title">
                {{ post.title }}
              </div>
            </td>
            <td class="px-4 py-3 text-sm">
              <button @click="handleUserClick(post.userId)" :class="[
                'text-red-400 hover:text-red-300 cursor-pointer transition-colors duration-200 truncate max-w-[120px]',
                { 'text-purple-600 dark:text-purple-600': isUserViewed(post.userId) }
              ]" :title="getUserEmail(post.userId)">
                {{ getUserEmail(post.userId) }}
              </button>
            </td>
            <td class="px-4 py-3 text-sm">
              <div class="text-white truncate max-w-[200px]" :title="post.body">
                {{ post.body }}
              </div>
            </td>
          </tr>
          <tr v-if="postsStore.paginatedPosts.length === 0 && !postsStore.loading">
            <td :colspan="columns.length" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              No posts found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="postsStore.loading && postsStore.paginatedPosts.length > 0" class="p-4 text-center">
      <LoadingSpinner class="w-6 h-6 mx-auto" />
    </div>
    <div v-if="!postsStore.hasMore && postsStore.paginatedPosts.length > 0"
      class="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
      No more posts to load
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useUsersStore } from '@/stores/users'
import LoadingSpinner from './LoadingSpinner.vue'
import { BiSolidDownArrowAlt, BiSolidUpArrowAlt } from 'vue-icons-plus/bi'

const postsStore = usePostsStore()
const usersStore = useUsersStore()
const tableContainer = ref(null)

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'email', label: 'Author' },
  { key: 'body', label: 'Content' }
]

const sortField = computed(() => postsStore.sortField)
const sortDirection = computed(() => postsStore.sortDirection)

const handleSort = (field) => {
  postsStore.sortPosts(field)
}

const handleUserClick = (userId) => {
  const user = usersStore.getUserById(userId)
  if (user) {
    usersStore.selectUser(user)
  }
}

const getUserEmail = (userId) => {
  const user = usersStore.getUserById(userId)
  return user ? user.email : `User ${userId}`
}

const isUserViewed = (userId) => {
  return usersStore.isUserViewed(userId)
}

const handleScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target
  const threshold = 100

  if (scrollHeight - scrollTop - clientHeight < threshold && !postsStore.loading && postsStore.hasMore) {
    postsStore.loadMore()
  }
}

onMounted(() => {
  if (postsStore.posts.length === 0) {
    postsStore.fetchPosts()
  }
})
</script>