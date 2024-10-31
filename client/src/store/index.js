// store/index.js
import { createStore } from 'vuex'
import VuexPersister from 'vuex-persister'
import userStore from './user'

const vuexPersister = new VuexPersister({
  // ...your options
  key: 'vuex-templateapp',
})

const store = createStore({
  modules: {
    user: userStore, // Registra el módulo de usuario
  },
  plugins: [vuexPersister.persist],
})

export default store
