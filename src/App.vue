<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase/config'

const router = useRouter()
const isLoggedIn = ref(false)

// Cek status login secara real-time saat komponen dimuat
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user; // Cara singkat untuk mengubah user/null menjadi true/false
  })
})

const handleLogout = () => {
  signOut(auth).then(() => {
    // Arahkan ke halaman login SETELAH proses logout selesai
    router.push('/login')
  })
}
</script>

<template>
  <header class="main-header">
    <nav>
      <router-link to="/" class="app-title-link">My To-Do App</router-link>
      <div class="nav-links">
        <div v-if="!isLoggedIn">
          <router-link to="/login">Login</router-link>
          <router-link to="/register">Register</router-link>
        </div>
        <button v-if="isLoggedIn" @click="handleLogout" class="logout-button">Logout</button>
      </div>
    </nav>
  </header>
  <main class="main-content">
    <router-view />
  </main>
</template>

<style>
/* Gaya Global Sederhana */
body {
  background-color: #f4f4f8;
  font-family: sans-serif;
  margin: 0;
  color: #333;
}

#app {
  min-height: 100vh;
}

/* Membuat konten utama (termasuk form) berada di tengah */
.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: 20px;
}

/* Kontainer Form (Kartu) */
.auth-form-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-form-container h2 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

/* Grup Form (label + input) */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Penting! */
}

.form-group input:focus {
  outline: none;
  border-color: #42b883; /* Warna hijau Vue */
}

/* Tombol Submit */
.submit-button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 4px;
  background-color: #42b883;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #36a374;
}

.submit-button:disabled {
  background-color: #a5d6b8;
  cursor: not-allowed;
}

/* Link & Error */
.switch-page-link {
  text-align: center;
  margin-top: 1.5rem;
}

.switch-page-link a {
  color: #42b883;
  text-decoration: none;
  font-weight: bold;
}

.error-message {
  color: #d9534f;
  text-align: center;
  margin-top: 1rem;
}
/* Gaya untuk Header & Navigasi */
.main-header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  position: sticky; /* Membuat navbar tetap di atas saat scroll */
  top: 0;
  z-index: 100;
}

.main-header nav {
  display: flex;
  justify-content: space-between; /* Judul di kiri, link/tombol di kanan */
  align-items: center;
  max-width: 1200px;
  margin: 0 auto; /* Menengahkan container nav */
  padding: 0 20px;
  height: 60px; /* Tinggi navbar */
}

/* Judul Aplikasi di Navbar */
.main-header .app-title-link {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

/* Wadah untuk link di kanan */
.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem; /* Jarak antar item */
}

.nav-links a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.nav-links a:hover {
  background-color: #f4f4f8;
}

.logout-button {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #c9302c;
}
</style>
