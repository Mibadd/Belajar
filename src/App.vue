<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const newTodo = ref('')
const todos = ref([])
const filter = ref('all')

function addTodo() {
  if (newTodo.value.trim() !== '') {
    todos.value.push({ text: newTodo.value, done: false })
  }
  newTodo.value = ''
}

function removeTodo(index) {
  todos.value.splice(index, 1)
}

const remainingTasks = computed(() => {
  return todos.value.filter(todo => !todo.done).length
})

const filteredTodos = computed(() => {
  if (filter.value === 'active') {
    return todos.value.filter(todo => !todo.done)
  } else if (filter.value === 'completed') {
    return todos.value.filter(todo => todo.done)
  }
  return todos.value
})

watch(todos, (newVal) => {
  localStorage.setItem('todos', JSON.stringify(newVal))
}, { deep: true })

onMounted(() => {
  const savedTodos = localStorage.getItem('todos')
  if (savedTodos) {
    todos.value = JSON.parse(savedTodos)
  }
})
</script>

<template>
  <main>
    <h1>My To-Do App</h1>

    <form @submit.prevent="addTodo">
      <input 
        v-model="newTodo" 
        placeholder="Apa rencanamu hari ini?"
      >
      <button>Add Todo</button>
    </form>
    
    <div class="filter-bar">
      <span>{{ remainingTasks }} tasks left</span>
      <div class="filters">
        <button @click="filter = 'all'" :class="{ active: filter === 'all' }">All</button>
        <button @click="filter = 'active'" :class="{ active: filter === 'active' }">Active</button>
        <button @click="filter = 'completed'" :class="{ active: filter === 'completed' }">Completed</button>
      </div>
    </div>

    <ul>
      <li v-for="(todo, index) in filteredTodos" :key="index">
        <input type="checkbox" v-model="todo.done">
        <span :class="{ done: todo.done }">{{ todo.text }}</span>
        <button @click="removeTodo(index)">Remove</button>
      </li>
    </ul>
  </main>
</template>

<style>
body {
  background-color: #f4f4f4;
  color: #333;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  padding: 0;
}

main {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #42b883;
}

form {
  display: flex;
  margin-bottom: 20px;
}

form input[type="text"] {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

form button {
  padding: 10px 15px;
  border: none;
  background-color: #42b883;
  color: white;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

li:last-child {
  border-bottom: none;
}

li input[type="checkbox"] {
  margin-right: 15px;
  width: 20px;
  height: 20px;
}

li span {
  flex-grow: 1;
}

.done {
  text-decoration: line-through;
  color: #aaa;
}

li button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
  color: #777;
}

.filters button {
  background: none;
  border: 1px solid transparent;
  color: #777;
  margin: 0 2px;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
}

.filters button.active {
  border-color: #42b883;
  color: #42b883;
}
</style>
