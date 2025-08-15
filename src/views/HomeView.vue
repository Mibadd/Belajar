<script setup>
import { ref, onUnmounted, computed } from 'vue'
import { db, auth } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'

// State
const projects = ref([])
const todos = ref([])
const newProjectName = ref('')
const newTodoText = ref('')
const newDueDate = ref('')
const selectedProjectId = ref(null)
const isLoadingProjects = ref(true)
const isLoadingTodos = ref(false)
const isSidebarOpen = ref(false); // State untuk sidebar mobile

// Referensi Koleksi
const projectsCollection = collection(db, 'projects')
const todosCollection = collection(db, 'todos')

let projectsUnsubscribe = null
let todosUnsubscribe = null

onAuthStateChanged(auth, (user) => {
  if (user) {
    const projectsQuery = query(projectsCollection, where("userId", "==", user.uid), orderBy("name", "asc"));
    projectsUnsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      projects.value = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      isLoadingProjects.value = false;
      if (!selectedProjectId.value && projects.value.length > 0) {
        selectProject(projects.value[0].id);
      }
    });
  } else {
    projects.value = [];
    todos.value = [];
    if (projectsUnsubscribe) projectsUnsubscribe();
    if (todosUnsubscribe) todosUnsubscribe();
  }
});

const selectProject = (projectId) => {
  selectedProjectId.value = projectId;
  isLoadingTodos.value = true;
  if (todosUnsubscribe) todosUnsubscribe();
  const todosQuery = query(
    todosCollection,
    where("projectId", "==", projectId),
    orderBy("createdAt", "desc")
  );
  todosUnsubscribe = onSnapshot(todosQuery, (snapshot) => {
    todos.value = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    isLoadingTodos.value = false;
  });
};

onUnmounted(() => {
  if (projectsUnsubscribe) projectsUnsubscribe();
  if (todosUnsubscribe) todosUnsubscribe();
});

const addProject = () => {
  if (newProjectName.value.trim() !== '' && auth.currentUser) {
    addDoc(projectsCollection, {
      name: newProjectName.value,
      userId: auth.currentUser.uid
    });
    newProjectName.value = '';
  }
};

const addTodo = () => {
  if (newTodoText.value.trim() !== '' && selectedProjectId.value && auth.currentUser) {
    addDoc(todosCollection, {
      text: newTodoText.value,
      done: false,
      createdAt: serverTimestamp(),
      userId: auth.currentUser.uid,
      projectId: selectedProjectId.value,
      dueDate: newDueDate.value || null
    });
    newTodoText.value = '';
    newDueDate.value = '';
  }
};

const removeTodo = (id) => {
  deleteDoc(doc(db, "todos", id));
};

const toggleDone = (id, currentStatus) => {
  updateDoc(doc(db, "todos", id), { done: !currentStatus });
};

const remainingTasks = computed(() => todos.value.filter(todo => !todo.done).length);
const selectedProject = computed(() => projects.value.find(p => p.id === selectedProjectId.value));

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
};
</script>

<template>
  <div class="relative flex w-full max-w-6xl mx-auto h-full md:h-[85vh] bg-white rounded-xl shadow-lg overflow-hidden">
    
    <!-- Tombol Menu (Hanya Tampil di Mobile) -->
    <button @click="isSidebarOpen = true" class="md:hidden absolute top-4 left-4 z-20 bg-gray-100 p-2 rounded-md shadow">
      <svg class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Overlay (Hanya Tampil di Mobile saat Sidebar Terbuka) -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"></div>

    <!-- Sidebar Proyek -->
    <div 
      class="w-full sm:w-2/3 md:w-1/4 bg-gray-50 border-r border-gray-200 p-5 flex flex-col transition-transform duration-300 ease-in-out fixed md:static top-0 left-0 h-full z-40"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <h2 class="text-lg font-bold text-gray-800 mb-4">Proyek Saya</h2>
      
      <div v-if="isLoadingProjects" class="text-center text-gray-500 py-4">Memuat proyek...</div>
      
      <ul v-else class="flex-grow space-y-2 overflow-y-auto">
        <li v-for="project in projects" :key="project.id">
          <button 
            @click="selectProject(project.id); isSidebarOpen = false"
            class="w-full text-left p-2 rounded-md transition-colors"
            :class="selectedProjectId === project.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-200'"
          >
            {{ project.name }}
          </button>
        </li>
      </ul>

      <form @submit.prevent="addProject" class="mt-4 pt-4 border-t border-gray-200">
        <input v-model="newProjectName" placeholder="Proyek baru..." class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
      </form>
    </div>

    <!-- Area Konten Tugas -->
    <div class="w-full p-5 md:p-8 flex flex-col overflow-y-auto">
      <div v-if="isLoadingTodos" class="m-auto text-center text-gray-500">
        <p class="text-xl font-semibold">Memuat tugas...</p>
      </div>
      <div v-else-if="selectedProject" class="pt-12 md:pt-0">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ selectedProject.name }}</h1>
        <p class="text-gray-500 mb-6">{{ remainingTasks }} tugas tersisa</p>

        <form @submit.prevent="addTodo" class="space-y-4 mb-6">
          <input v-model="newTodoText" placeholder="Tambahkan tugas di proyek ini..." class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
          <div class="flex gap-4">
            <input type="date" v-model="newDueDate" class="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <button type="submit" class="bg-blue-600 text-white font-bold text-2xl px-5 rounded-lg hover:bg-blue-700 transition-colors">+</button>
          </div>
        </form>

        <ul class="divide-y divide-gray-200">
          <li v-for="todo in todos" :key="todo.id" class="py-4 flex items-start">
            <input type="checkbox" :checked="todo.done" @change="toggleDone(todo.id, todo.done)" class="h-5 w-5 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer">
            <div class="ml-3 flex-grow">
              <span class="text-gray-800" :class="{'line-through text-gray-400': todo.done}">{{ todo.text }}</span>
              <div v-if="todo.dueDate" class="text-xs mt-1" :class="{'text-red-500 font-semibold': isOverdue(todo.dueDate) && !todo.done}">
                Jatuh tempo: {{ new Date(todo.dueDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
              </div>
            </div>
            <button @click="removeTodo(todo.id)" class="text-gray-400 hover:text-red-500 transition-colors">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </li>
        </ul>
      </div>
      <div v-else class="m-auto text-center text-gray-500">
        <p class="text-4xl mb-2">👈</p>
        <h3 class="text-xl font-semibold">Pilih atau buat proyek</h3>
        <p class="md:hidden">Gunakan tombol menu di pojok kiri atas untuk memulai.</p>
        <p class="hidden md:block">Pilih proyek di sebelah kiri untuk memulai.</p>
      </div>
    </div>
  </div>
</template>