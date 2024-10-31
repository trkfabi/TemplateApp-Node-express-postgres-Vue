import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/components/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/auth/LoginView.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/components/admin/AdminView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/components/user/UserView.vue'),
    meta: { requiresAuth: true },
  },
  // otras rutas...
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['user/isAuthenticated'] // Verifica si el usuario está autenticado
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  if (requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario no está autenticado, redirige a login
    next({ path: '/login' })
  } else if (
    requiresAdmin &&
    (!isAuthenticated ||
      (store.getters['user/getProfile']?.role.toLowerCase() !== 'admin' &&
        store.getters['user/getProfile']?.role.toLowerCase() !== 'superadmin'))
  ) {
    // Si la ruta requiere rol de admin y el usuario no es admin, redirige a home o a otra página
    next({ path: '/user' }) // Cambia esto a la ruta que desees
  } else {
    next() // Permite el acceso
  }
})

export default router
