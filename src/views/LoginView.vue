<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'

const email = ref('')
const password = ref('')
const errorMsg = ref(null)
const isLoading = ref(false)
const router = useRouter()

const login = () => {
  isLoading.value = true
  errorMsg.value = null
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      router.push('/')
    })
    .catch((error) => {
      switch(error.code) {
        case 'auth/invalid-email':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMsg.value = "Email atau password yang Anda masukkan salah."
          break;
        default:
          errorMsg.value = "Terjadi kesalahan. Silakan coba lagi."
          break;
      }
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<template>
  <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
    <form @submit.prevent="login">
      <div class="mb-4">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input id="email" type="email" v-model="email" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div class="mb-6">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <input id="password" type="password" v-model="password" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <button type="submit" :disabled="isLoading" class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
        {{ isLoading ? 'Loading...' : 'Login' }}
      </button>
      <p v-if="errorMsg" class="text-red-500 text-sm mt-4 text-center">{{ errorMsg }}</p>
    </form>
    <p class="text-center text-sm text-gray-600 mt-6">
      Belum punya akun? <router-link to="/register" class="font-medium text-blue-600 hover:underline">Daftar di sini</router-link>
    </p>
  </div>
</template>