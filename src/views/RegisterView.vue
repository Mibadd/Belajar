<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'

// State untuk form
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref(null)

// State untuk UI
const isLoading = ref(false)
const router = useRouter()

const register = () => {
  // Validasi password
  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Password dan konfirmasi password tidak cocok."
    return
  }

  isLoading.value = true
  errorMsg.value = null

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      router.push('/')
    })
    .catch((error) => {
      // Menangani error dari Firebase
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
  <div class="auth-form-container">
    <h2>Register Akun Baru</h2>

    <form @submit.prevent="register">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email" required>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" required>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Konfirmasi Password</label>
        <input id="confirmPassword" type="password" v-model="confirmPassword" required>
      </div>

      <button type="submit" :disabled="isLoading" class="submit-button">
        {{ isLoading ? 'Loading...' : 'Register' }}
      </button>

      <p v-if="errorMsg" class="error-message">
        {{ errorMsg }}
      </p>
    </form>

    <p class="switch-page-link">
      Sudah punya akun? <router-link to="/login">Login di sini</router-link>
    </p>
  </div>
</template>