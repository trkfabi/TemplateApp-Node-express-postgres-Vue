import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from './i18n'
import store from './store'
import router from './router'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(i18n)
app.mount('#app')
