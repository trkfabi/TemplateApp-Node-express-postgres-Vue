<template>
  <div id="app" class="flex flex-col h-screen">
    <HeaderView />
    <div class="flex flex-grow">
      <SidebarView v-if="isAuthenticated" />
      <div class="flex-grow p-4">
        <router-view />
      </div>
    </div>
    <FooterView />
  </div>
</template>

<script setup>
import HeaderView from './components/layout/HeaderView.vue'
import FooterView from './components/layout/FooterView.vue'
import SidebarView from './components/layout/SidebarView.vue'

import { computed } from 'vue'
import { useStore } from 'vuex'

// Usar useStore para acceder a la tienda Vuex
const store = useStore()

// Computed property para verificar si el usuario está autenticado
const isAuthenticated = computed(() => store.getters['user/isAuthenticated'])
</script>

<style>
/* En tu archivo CSS global o en el estilo de App.vue */
#app {
  display: flex; /* Habilita Flexbox */
  flex-direction: column; /* Coloca los elementos en una columna */
  min-height: 100vh; /* Asegura que el contenedor tenga al menos la altura de la pantalla */
}

.flex-grow {
  flex-grow: 1; /* Permite que el contenido del router-view ocupe el espacio restante */
}

footer {
  margin-top: auto; /* Asegura que el footer esté en la parte inferior */
}
</style>
