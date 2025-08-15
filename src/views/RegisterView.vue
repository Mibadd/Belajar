<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref(null)
const isLoading = ref(false)
const router = useRouter()

const register = () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Password dan konfirmasi password tidak cocok."
    return
  }
  
  isLoading.value = true
  errorMsg.value = null

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // Membuat dokumen profil pengguna hanya dengan email
      const userDocRef = doc(db, "users", userCredential.user.uid);
      setDoc(userDocRef, {
        email: userCredential.user.email
      });
      
      router.push('/')
    })
    .catch((error) => {
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMsg.value = "Email ini sudah terdaftar."
          break;
        case 'auth/weak-password':
          errorMsg.value = "Password terlalu lemah (minimal 6 karakter)."
          break;
        default:
          errorMsg.value = "Terjadi kesalahan saat pendaftaran."
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
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Register Akun Baru</h2>
    <form @submit.prevent="register">
      <div class="mb-4">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input id="email" type="email" v-model="email" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div class="mb-4">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <input id="password" type="password" v-model="password" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div class="mb-6">
        <label for="confirmPassword" class="block mb-2 text-sm font-medium text-gray-700">Konfirmasi Password</label>
        <input id="confirmPassword" type="password" v-model="confirmPassword" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <button type="submit" :disabled="isLoading" class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
        {{ isLoading ? 'Loading...' : 'Register' }}
      </button>
      <p v-if="errorMsg" class="text-red-500 text-sm mt-4 text-center">{{ errorMsg }}</p>
    </form>
    <p class="text-center text-sm text-gray-600 mt-6">
      Sudah punya akun? <router-link to="/login" class="font-medium text-blue-600 hover:underline">Login di sini</router-link>
    </p>
  </div>
</template>