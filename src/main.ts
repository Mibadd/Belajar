import './style.css'

// Kita simulasikan database dengan sebuah array of objects.
const users = [
  { username: 'admin', password: 'password123' },
  { username: 'budi', password: 'passwordbudi' },
  { username: 'citra', password: 'passwordcitra' }
];

// Ambil semua elemen yang kita butuhkan dari HTML
const loginSection = document.querySelector<HTMLDivElement>('#loginSection')!
const welcomeSection = document.querySelector<HTMLDivElement>('#welcomeSection')!
const loginForm = document.querySelector<HTMLFormElement>('#loginForm')!
const usernameInput = document.querySelector<HTMLInputElement>('#username')!
const passwordInput = document.querySelector<HTMLInputElement>('#password')!
const messageElement = document.querySelector<HTMLParagraphElement>('#message')!
const logoutButton = document.querySelector<HTMLButtonElement>('#logoutButton')!
const loggedInUserSpan = document.querySelector<HTMLSpanElement>('#loggedInUser')!

// Event listener untuk form login
loginForm.addEventListener('submit', (event) => {
  event.preventDefault()

  const username = usernameInput.value
  const password = passwordInput.value

  // --- LOGIKA LOGIN BARU ---
  // Cari pengguna di dalam array 'users'
  const foundUser = users.find(user => user.username === username && user.password === password);

  if (foundUser) { // Jika pengguna ditemukan
    messageElement.textContent = ''

    // Isi span dengan username yang berhasil login
    loggedInUserSpan.textContent = foundUser.username

    // Tampilkan halaman sambutan
    loginSection.style.display = 'none'
    welcomeSection.style.display = 'block'

  } else { // Jika pengguna tidak ditemukan
    messageElement.textContent = 'Username atau password salah!'
    messageElement.style.color = 'red'
  }
})

// Event listener untuk logout (tidak perlu diubah)
logoutButton.addEventListener('click', () => {
  usernameInput.value = ''
  passwordInput.value = ''
  welcomeSection.style.display = 'none'
  loginSection.style.display = 'block'
})