// store/user.js
const userStore = {
  namespaced: true, // Permite usar el módulo de forma independiente
  state: {
    isAuthenticated: false,
    profile: null,
    id: null,
    email: null,
  },
  mutations: {
    setAuthentication(state, payload) {
      state.isAuthenticated = payload.isAuthenticated
      state.id = payload.id
      state.email = payload.email
      state.profile = payload.profile
    },
    logout(state) {
      state.isAuthenticated = false
      state.profile = null
      state.id = null
      state.email = null
    },
  },
  actions: {
    setUserData({ commit }, userData) {
      commit('setAuthentication', userData)
    },
    logout({ commit }) {
      commit('logout')
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated
    },
    getId(state) {
      return state.id
    },
    getEmail(state) {
      return state.email
    },
    getProfile(state) {
      return state.profile
    },
  },
}

export default userStore
