import './style.css'

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
  loginSection.style.display = 'block';
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
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newUsername = newUsernameInput.value.trim();
  const newPassword = newPasswordInput.value.trim();

  if (!newUsername || !newPassword) {
    registerMessage.textContent = 'Username dan password tidak boleh kosong!';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newUsername, newPassword }),
    });

    const data = await response.json();
    registerMessage.textContent = data.message;
    registerMessage.style.color = data.success ? 'green' : 'red';

    if (response.ok) {
      setTimeout(() => showLoginPage(), 2000);
    }
  } catch (error) {
    registerMessage.textContent = 'Terjadi kesalahan saat registrasi.';
  }
});

// --- LOGIKA LOGIN ---
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    messageElement.textContent = 'Username dan password tidak boleh kosong!';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    messageElement.textContent = data.message;
    messageElement.style.color = data.success ? 'green' : 'red';

    if (response.ok && data.success) {
      // --- PERUBAHAN UTAMA: Simpan username dan token ---
      localStorage.setItem('loggedInUser', data.data.username);
      localStorage.setItem('authToken', data.data.token);
      showWelcomePage(data.data.username);
    }
  } catch (error) {
    messageElement.textContent = 'Terjadi kesalahan saat login.';
  }
});

// --- LOGIKA LOGOUT ---
logoutButton.addEventListener('click', () => {
  // Hapus username dan token saat logout
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('authToken');
  showLoginPage();
});

// --- PEMERIKSAAN SESI SAAT HALAMAN DIMUAT ---
const checkSession = () => {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const token = localStorage.getItem('authToken');

  // Hanya tampilkan halaman welcome jika ada username DAN token
  if (loggedInUser && token) {
    showWelcomePage(loggedInUser);
  } else {
    showLoginPage();
  }
};

checkSession();