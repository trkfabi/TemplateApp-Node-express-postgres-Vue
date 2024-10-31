<template>
  <div id="app">
    <HeaderView />
    <router-view class="flex-grow"></router-view>
    <FooterView />
  </div>
</template>

<script>
import HeaderView from './components/layout/HeaderView.vue'
import FooterView from './components/layout/FooterView.vue'
import HomeView from './components/HomeView.vue'
import LoginView from './components/auth/LoginView.vue'
import AdminView from './components/admin/AdminView.vue'
import UserView from './components/user/UserView.vue'
export default {
  name: 'App',
  components: {
    HeaderView,
    FooterView,
    HomeView,
    LoginView,
    AdminView,
    UserView,
  },
}
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
