<template>
  <nav>
    <ul>
      <li v-if="isAuthenticated">Bienvenido, {{ email }}!</li>
      <li v-if="isAuthenticated">Rol: {{ role }}</li>
      <li v-if="isAuthenticated">
        <button @click="logout">Cerrar Sesión</button>
      </li>
      <li v-else>
        <router-link to="/login">Iniciar Sesión</router-link>
      </li>
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
const logout = () => {
  store.dispatch('user/logout')
}
</script>
<script setup></script>

<style lang="scss" scoped></style>
