<template>
  <div>
    <div class="relative bg-primary-50 md:pt-32 pb-32 pt-12">
      <div class="px-4 md:px-10 mx-auto w-full">
        <nav>
          <ul>
            <li v-if="isAuthenticated">Bienvenido, {{ email }}!</li>
            <li v-if="isAuthenticated">Rol: {{ role }}</li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const isAuthenticated = computed(() => store.getters['user/isAuthenticated'])
const email = computed(() => store.getters['user/getEmail'])
const profile = computed(() => store.getters['user/getProfile'])
let role = ''
if (profile.value) {
  role = profile.value.role
}
const logout = () => {
  store.dispatch('user/logout')
}
</script>
