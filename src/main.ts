import './style.css'

// --- DATABASE PENGGUNA ---
const users = [
  { username: 'admin', password: 'password123' },
  { username: 'budi', password: 'passwordbudi' },
  { username: 'citra', password: 'passwordcitra' }
];

// --- AMBIL SEMUA ELEMEN HTML ---
const loginSection = document.querySelector<HTMLDivElement>('#loginSection')!
const welcomeSection = document.querySelector<HTMLDivElement>('#welcomeSection')!
const registerSection = document.querySelector<HTMLDivElement>('#registerSection')!

const loginForm = document.querySelector<HTMLFormElement>('#loginForm')!
const usernameInput = document.querySelector<HTMLInputElement>('#username')!
const passwordInput = document.querySelector<HTMLInputElement>('#password')!
const messageElement = document.querySelector<HTMLParagraphElement>('#message')!

const registerForm = document.querySelector<HTMLFormElement>('#registerForm')!
const newUsernameInput = document.querySelector<HTMLInputElement>('#newUsername')!
const newPasswordInput = document.querySelector<HTMLInputElement>('#newPassword')!
const registerMessage = document.querySelector<HTMLParagraphElement>('#registerMessage')!

const logoutButton = document.querySelector<HTMLButtonElement>('#logoutButton')!
const loggedInUserSpan = document.querySelector<HTMLSpanElement>('#loggedInUser')!
const showRegisterLink = document.querySelector<HTMLAnchorElement>('#showRegister')!
const showLoginLink = document.querySelector<HTMLAnchorElement>('#showLogin')!


// --- FUNGSI UNTUK MENGATUR TAMPILAN ---
const showWelcomePage = (username: string) => {
  loggedInUserSpan.textContent = username;
  loginSection.style.display = 'none';
  registerSection.style.display = 'none';
  welcomeSection.style.display = 'block';
}

const showLoginPage = () => {
  usernameInput.value = '';
  passwordInput.value = '';
  messageElement.textContent = '';
  registerSection.style.display = 'none';
  loginSection.style.display = 'block'; // Pastikan ini 'block'
  welcomeSection.style.display = 'none';
}


// --- LOGIKA PINDAH FORM ---
showRegisterLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginSection.style.display = 'none';
  registerSection.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  registerSection.style.display = 'none';
  loginSection.style.display = 'block';
});

// --- LOGIKA REGISTRASI ---
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newUsername = newUsernameInput.value.trim();
  const newPassword = newPasswordInput.value.trim();

  if (!newUsername || !newPassword) {
    registerMessage.textContent = 'Username dan password tidak boleh kosong!';
    return;
  }
  if (users.find(user => user.username === newUsername)) {
    registerMessage.textContent = 'Username sudah digunakan!';
  } else {
    users.push({ username: newUsername, password: newPassword });
    registerMessage.textContent = 'Registrasi berhasil! Silakan login.';
    setTimeout(() => showLoginPage(), 2000);
  }
});

// --- LOGIKA LOGIN ---
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    messageElement.textContent = 'Username dan password tidak boleh kosong!';
    return;
  }

  const foundUser = users.find(user => user.username === username && user.password === password);

  if (foundUser) {
    localStorage.setItem('loggedInUser', foundUser.username);
    showWelcomePage(foundUser.username);
  } else {
    messageElement.textContent = 'Username atau password salah!';
  }
});

// --- LOGIKA LOGOUT ---
logoutButton.addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  showLoginPage();
});

// --- PEMERIKSAAN SESI SAAT HALAMAN DIMUAT ---
const checkSession = () => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    showWelcomePage(loggedInUser);
  } else {
    showLoginPage(); // Ini akan memastikan form login yang tampil
  }
};

// Jalankan saat aplikasi dimuat
checkSession();