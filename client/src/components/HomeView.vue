<template>
  <nav>
    <ul>
      <li v-if="isAuthenticated">Bienvenido, {{ email }}!</li>
      <li v-if="isAuthenticated">Rol: {{ role }}</li>
    </ul>
  </nav>
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
</script>
<script setup></script>

<style lang="scss" scoped></style>
