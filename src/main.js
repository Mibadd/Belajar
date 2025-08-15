// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// Hapus baris import './assets/style.css'
import './index.css' // <-- Cukup satu baris ini

const app = createApp(App)
app.use(router)
app.mount('#app')