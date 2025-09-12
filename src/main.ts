import './style.css'

// --- DATABASE PENGGUNA ---
const users = [
  { username: 'admin', password: 'password123' },
  { username: 'budi', password: 'passwordbudi' },
  { username: 'citra', password: 'passwordcitra' }
];

// --- AMBIL ELEMEN HTML ---
const loginSection = document.querySelector<HTMLDivElement>('#loginSection')!
const welcomeSection = document.querySelector<HTMLDivElement>('#welcomeSection')!
const loginForm = document.querySelector<HTMLFormElement>('#loginForm')!
const usernameInput = document.querySelector<HTMLInputElement>('#username')!
const passwordInput = document.querySelector<HTMLInputElement>('#password')!
const messageElement = document.querySelector<HTMLParagraphElement>('#message')!
const logoutButton = document.querySelector<HTMLButtonElement>('#logoutButton')!
const loggedInUserSpan = document.querySelector<HTMLSpanElement>('#loggedInUser')!

// --- FUNGSI UNTUK MENGATUR TAMPILAN ---
const showWelcomePage = (username: string) => {
  loggedInUserSpan.textContent = username;
  loginSection.style.display = 'none';
  welcomeSection.style.display = 'block';
}

const showLoginPage = () => {
  usernameInput.value = '';
  passwordInput.value = '';
  loginSection.style.display = 'block';
  welcomeSection.style.display = 'none';
}

// --- LOGIKA LOGIN ---
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;
  const foundUser = users.find(user => user.username === username && user.password === password);

  if (foundUser) {
    // Simpan username ke localStorage saat login berhasil
    localStorage.setItem('loggedInUser', foundUser.username);
    showWelcomePage(foundUser.username);
  } else {
    messageElement.textContent = 'Username atau password salah!';
    messageElement.style.color = 'red';
  }
});

// --- LOGIKA LOGOUT ---
logoutButton.addEventListener('click', () => {
  // Hapus username dari localStorage saat logout
  localStorage.removeItem('loggedInUser');
  showLoginPage();
});

// --- PEMERIKSAAN SESI SAAT HALAMAN DIMUAT ---
const checkSession = () => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    // Jika ada sesi, langsung tampilkan halaman selamat datang
    showWelcomePage(loggedInUser);
  } else {
    // Jika tidak ada sesi, tampilkan halaman login
    showLoginPage();
  }
};

// Jalankan pemeriksaan sesi saat aplikasi pertama kali dimuat
checkSession();