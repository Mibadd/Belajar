// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

// Fungsi untuk menunggu status auth siap
const waitForAuthInit = () => {
    return new Promise(resolve => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe(); // Berhenti mendengarkan setelah status pertama didapat
            resolve(user);
        });
    });
};

const routes = [
    // ... (definisi rute Anda tetap sama)
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

// --- NAVIGATION GUARD YANG DIPERBARUI ---
router.beforeEach(async (to, from, next) => {
    await waitForAuthInit(); // <-- TAMBAHKAN INI: Tunggu auth siap
    const isAuthenticated = !!auth.currentUser;

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    if (requiresAuth && !isAuthenticated) {
        next('/login')
    } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
        next('/')
    } else {
        next()
    }
})

export default router