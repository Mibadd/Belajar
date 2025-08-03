// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config' // <-- 1. Impor auth
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// --- 2. BUAT NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isAuthenticated = auth.currentUser

    if (requiresAuth && !isAuthenticated) {
        // Jika rute butuh login TAPI pengguna belum login,
        // alihkan ke halaman login.
        next('/login')
    } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
        // Jika pengguna sudah login TAPI mencoba akses halaman Login/Register,
        // alihkan ke halaman utama.
        next('/')
    } else {
        // Jika tidak ada masalah, lanjutkan navigasi.
        next()
    }
})

export default router