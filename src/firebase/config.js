// src/firebase/config.js

// Import fungsi yang diperlukan dari Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Konfigurasi Firebase Anda (tempelkan objek yang Anda salin di sini)
const firebaseConfig = {
    apiKey: "AIzaSyAJf4DgXWB1ZqqacfYlP_tNE25jEr0XlgE",
    authDomain: "to-do-list-ec95e.firebaseapp.com",
    projectId: "to-do-list-ec95e",
    storageBucket: "to-do-list-ec95e.firebasestorage.app",
    messagingSenderId: "182587258269",
    appId: "1:182587258269:web:c405002344a2d1f4192b74",
    measurementId: "G-S2R4TC1PWF"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi layanan Firebase yang akan kita gunakan
const db = getFirestore(app);
const auth = getAuth(app);

// Ekspor layanan agar bisa digunakan di file lain
export { db, auth };