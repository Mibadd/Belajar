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
      switch (error.code) {
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
  <div class="auth-form-container">
    <h2>Login</h2>
    
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email" required>
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" required>
      </div>
      
      <button type="submit" :disabled="isLoading" class="submit-button">
        {{ isLoading ? 'Loading...' : 'Login' }}
      </button>

      <p v-if="errorMsg" class="error-message">
        {{ errorMsg }}
      </p>
    </form>

    <p class="switch-page-link">
      Belum punya akun? <router-link to="/register">Daftar di sini</router-link>
    </p>
  </div>
</template>