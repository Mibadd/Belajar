<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase/config'

const router = useRouter()
const isLoggedIn = ref(false)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  })
})

const handleLogout = () => {
  signOut(auth).then(() => {
    router.push('/login')
  })
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-100 font-sans">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold text-gray-800">My To-Do App</router-link>
        <div class="flex items-center space-x-4">
          <div v-if="!isLoggedIn" class="space-x-4">
            <router-link to="/login" class="text-gray-600 hover:text-blue-600">Login</router-link>
            <router-link to="/register" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Register</router-link>
          </div>
          <button v-if="isLoggedIn" @click="handleLogout" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Logout</button>
        </div>
      </nav>
    </header>
    <main class="flex-grow container mx-auto p-6 flex justify-center items-center">
      <router-view />
    </main>
  </div>
</template>

<style>
/* KOSONGKAN BAGIAN INI */
/* SEMUA STYLE SEKARANG DIATUR OLEH TAILWIND */
</style>