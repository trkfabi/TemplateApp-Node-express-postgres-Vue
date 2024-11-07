import axios from 'axios'
import {
  clearTokens,
  getAuthToken,
  getRefreshToken,
  saveAuthToken,
  saveRefreshToken,
} from '@/utils/auth'
import { useRouter } from 'vue-router'

const xApiClienteResource = import.meta.env.VITE_CLIENTID_ENVIRONMENT // this may be used by NGINX to redirect
const apiUrl = import.meta.env.VITE_API_URL

const apiClient = axios.create({
  baseURL: `${apiUrl}/api/v1`, // Usa la base URL del servidor
})

// Agregar un interceptor para incluir el token dinámicamente
apiClient.interceptors.request.use(
  config => {
    const authToken = getAuthToken()
    const refreshToken = getRefreshToken()
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
    if (refreshToken) {
      config.headers['set-refresh-token'] = refreshToken
    }
    config.headers['x-api-client-resource'] = xApiClienteResource // this may be used by NGINX to redirect
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// Agregar un interceptor para manejar las respuestas
apiClient.interceptors.response.use(
  response => {
    // Retorna la respuesta si es exitosa
    return response
  },
  error => {
    // Manejar errores de respuesta
    const { response } = error
    if (response && response.status === 400) {
      // Si el token ha expirado (status 400), realizar logout
      clearTokens()
      const router = useRouter()
      router.push('/login') // Redirigir a la página de login
    }
    return Promise.reject(error) // Lanza el error para manejarlo en otros lugares si es necesario
  },
)

export const Api = {
  user: {
    async login({ email, password, remember }) {
      try {
        const response = await apiClient.post(`/user/login`, {
          email,
          password,
        })
        if (response.data.success) {
          const authToken = response.headers['x-auth-token']
          const refreshToken = response.headers['x-refresh-token']
          if (authToken) {
            saveAuthToken(authToken, remember)
          }
          if (refreshToken) {
            saveRefreshToken(refreshToken, remember)
          }
        } else {
          clearTokens()
        }
        return response
      } catch (error) {
        console.log('Error en login:', error)
        throw error // Lanza el error para manejarlo en otro lugar si es necesario
      }
    },
    async logout() {
      await apiClient.post(`/user/logout`)
      clearTokens()
    },
    async all() {
      try {
        //
      } catch (error) {
        console.log(error)
      }
    },
    async me() {
      try {
        const response = await apiClient.get(`/user/me`)

        return response
      } catch (error) {
        console.log(error)
      }
    },
  },
}
