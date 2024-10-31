<template>
  <header>
    <nav
      class="bg-white w-full border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800"
    >
      <div class="flex justify-between items-center mx-auto">
        <a href="/" class="flex items-center">
          <img
            src="https://inzori.com/img/logo_small.png"
            class="mr-3 h-6 sm:h-9"
            alt="Inzori Logo"
          />
        </a>
        <div class="flex items-center ml-auto">
          <!-- Agregar ml-auto aquí -->
          <a
            v-if="!isAuthenticated"
            href="/login"
            class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            >{{ $t('home.loginButtonTitle') }}</a
          >
          <span class="pr-3 text-primary-700" v-if="isAuthenticated">
            Hello, {{ username }}
          </span>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()

const isAuthenticated = computed(() => store.getters['user/isAuthenticated'])
const isAdmin = computed(
  () =>
    store.getters['user/getProfile']?.role.toLowerCase() === 'admin' ||
    store.getters['user/getProfile']?.role.toLowerCase() === 'superadmin',
) // Ajusta según tu lógica
const username = computed(() => {
  return (
    store.getters['user/getProfile']?.firstName ||
    store.getters['user/getEmail']
  )
})
const avatarUrl = computed(() => store.getters['user/getProfile']?.avatarUrl)

const logout = () => {
  store.dispatch('user/logout') // Asumiendo que tienes una acción de logout
  // Redirigir a la página de inicio o login
  router.push('/')
}

// Estado para controlar el menú hamburguesa
const isMenuOpen = ref(false) // Nuevo estado

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<style scoped>
/* Estilos para el header */
</style>
