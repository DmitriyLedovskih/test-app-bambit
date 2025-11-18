<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" @click="handleOverlayClick">
    <div ref="cardRef" class="bg-emerald-700 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
      @click.stop>
      <div class="flex justify-between items-center py-3 px-4 border-b border-b-white">
        <h2 class="text-xl font-semibold text-white">
          User Profile
        </h2>
        <button @click="closeModal"
          class="text-white hover:text-gray-300 cursor-pointer transition-colors duration-200">
          <AiOutlineClose class="w-6 h-6" />
        </button>
      </div>
      <div class="p-4 space-y-4 overflow-y-auto max-h-[80vh]">
        <div>
          <label class="text-sm font-medium text-white">Name</label>
          <p class="mt-1 text-white">{{ user.name || 'N/A' }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-white">Username</label>
          <p class="mt-1 text-white">{{ user.username || 'N/A' }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-white">Email</label>
          <p class="mt-1 text-white">{{ user.email || 'N/A' }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-white">Phone</label>
          <p class="mt-1 text-white">{{ user.phone || 'N/A' }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-white">Website</label>
          <p class="mt-1">
            <a v-if="user.website" :href="`https://${user.website}`" target="_blank"
              class="text-red-500 hover:text-red-400 transition-colors duration-200">
              {{ user.website }}
            </a>
            <span v-else class="text-white">N/A</span>
          </p>
        </div>
        <div>
          <label class="text-sm font-medium text-white">Company</label>
          <p class="mt-1 text-white">{{ user.company?.name || 'N/A' }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-white">Address</label>
          <p class="mt-1 text-white">
            {{ formatAddress(user.address) || 'N/A' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { AiOutlineClose } from 'vue-icons-plus/ai'

defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const cardRef = ref(null)

const lockScroll = () => {
  document.body.classList.add('overflow-hidden')
}

const unlockScroll = () => {
  document.body.classList.remove('overflow-hidden')
}

const closeModal = () => {
  unlockScroll()
  emit('close')
}

const formatAddress = (address) => {
  if (!address) return ''
  const { street, suite, city } = address
  return [street, suite, city].filter(Boolean).join(', ')
}

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

const handleEscape = (event) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

onMounted(() => {
  lockScroll()
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  unlockScroll()
  document.removeEventListener('keydown', handleEscape)
})
</script>