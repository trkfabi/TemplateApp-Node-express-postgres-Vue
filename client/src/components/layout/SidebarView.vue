<template>
  <div
    class="h-full p-3 bg-white space-y-2 w-60 dark:bg-gray-50 dark:text-gray-800"
  >
    <div class="flex items-center p-2 space-x-4">
      <img
        :src="avatarUrl"
        alt="User Avatar"
        class="w-12 h-12 rounded-full dark:bg-gray-500"
      />
      <div>
        <h2 class="text-md font-semibold">{{ username }}</h2>
        <span class="flex items-center space-x-1">
          <a
            rel="noopener noreferrer"
            href="#"
            class="text-xs hover:underline dark:text-gray-600"
            >View profile</a
          >
        </span>
      </div>
    </div>
    <div class="divide-y dark:divide-gray-300">
      <ul v-if="isAuthenticated && isAdmin" class="pt-4 pb-2 space-y-1 text-sm">
        <li>
          <a
            rel="noopener noreferrer"
            href="/admin"
            class="flex items-center p-2 space-x-3 rounded-md hover:text-primary-500"
          >
            <i class="fas fa-user w-5 h-5 dark:text-gray-600"></i>
            <span>Go to Admin</span>
          </a>
        </li>
      </ul>
      <ul class="pt-2 pb-4 space-y-1 text-sm">
        <li class="dark:bg-gray-100 dark:text-gray-900">
          <a
            rel="noopener noreferrer"
            href="#"
            class="flex items-center p-2 space-x-3 rounded-md hover:text-primary-500"
          >
            <i class="fas fa-tachometer-alt w-5 h-5 dark:text-gray-600"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a
            rel="noopener noreferrer"
            href="#"
            class="flex items-center p-2 space-x-3 rounded-md hover:text-primary-500"
          >
            <i class="fas fa-search w-5 h-5 dark:text-gray-600"></i>
            <span>Search</span>
          </a>
        </li>
        <li>
          <a
            rel="noopener noreferrer"
            href="#"
            class="flex items-center p-2 space-x-3 rounded-md hover:text-primary-500"
          >
            <i class="fas fa-comments w-5 h-5 dark:text-gray-600"></i>
            <span>Chat</span>
          </a>
        </li>
        <li>
          <a
            rel="noopener noreferrer"
            href="#"
            class="flex items-center p-2 space-x-3 rounded-md hover:text-primary-500"
          >
            <i class="fas fa-shopping-cart w-5 h-5 dark:text-gray-600"></i>
            <span>Orders</span>
          </a>
        </li>
        <li>
          <a
            rel="noopener noreferrer"
            href="#"
            class="flex items-center p-2 space-x-3 rounded-md hover:text-primary-500"
          >
            <i class="fas fa-heart w-5 h-5 dark:text-gray-600"></i>
            <span>Wishlist</span>
          </a>
        </li>
      </ul>
      <ul class="pt-4 pb-2 space-y-1 text-sm">
        <li>
          <a
            rel="noopener noreferrer"
            href="#"
            class="flex items-center p-2 space-x-3 rounded-md hover:text-primary-500"
          >
            <i class="fas fa-cog w-5 h-5 dark:text-gray-600"></i>
            <span>Settings</span>
          </a>
        </li>
        <li v-if="isAuthenticated">
          <a
            rel="noopener noreferrer"
            href="#"
            @click.prevent="logout"
            class="flex items-center p-2 space-x-3 rounded-md hover:text-primary-500"
          >
            <i class="fas fa-sign-out w-5 h-5 dark:text-gray-600"></i>
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { Api } from '@/services/api'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import defaultAvatar from '@/assets/images/user.png'

const store = useStore()
const router = useRouter()

const avatarUrl = computed(
  () => store.getters['user/getProfile']?.avatarUrl || defaultAvatar,
)

const username = computed(() => {
  return (
    store.getters['user/getProfile']?.firstName ||
    store.getters['user/getEmail']
  )
})

const isAuthenticated = computed(() => store.getters['user/isAuthenticated'])

const isAdmin = computed(
  () =>
    store.getters['user/getProfile']?.role.toLowerCase() === 'admin' ||
    store.getters['user/getProfile']?.role.toLowerCase() === 'superadmin',
)

const logout = async () => {
  store.dispatch('user/logout')
  Api.user.logout()
  router.push('/')
}
</script>
