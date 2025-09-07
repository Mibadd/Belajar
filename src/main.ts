import './style.css'

const loginSection = document.querySelector<HTMLDivElement>('#loginSection')!
const welcomeSection = document.querySelector<HTMLDivElement>('#welcomeSection')!
const loginForm = document.querySelector<HTMLFormElement>('#loginForm')!
const usernameInput = document.querySelector<HTMLInputElement>('#username')!
const passwordInput = document.querySelector<HTMLInputElement>('#password')!
const messageElement = document.querySelector<HTMLParagraphElement>('#message')!
const logoutButton = document.querySelector<HTMLButtonElement>('#logoutButton')!
const loggedInUserSpan = document.querySelector<HTMLSpanElement>('#loggedInUser')!

loginForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const username = usernameInput.value
  const password = passwordInput.value

  if (username === 'user' && password === 'password123') {
    messageElement.textContent = ''
    loggedInUserSpan.textContent = username
    loginSection.style.display = 'none'
    welcomeSection.style.display = 'block'
  } else {
    messageElement.textContent = 'Username atau password salah!'
    messageElement.style.color = 'red'
  }
})

logoutButton.addEventListener('click', () => {
  usernameInput.value = ''
  passwordInput.value = ''
  welcomeSection.style.display = 'none'
  loginSection.style.display = 'block'
})
