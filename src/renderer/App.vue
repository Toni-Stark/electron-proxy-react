<template>
  <div id="app">
    <h1>Electron 22 + Vite + Vue 3</h1>
    <p></p>
    <p>{{ isDev ? '开发' : '生产' }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDev = ref(false)

onMounted(() => {
  // 检查是否为开发环境
  isDev.value = window.location.href.includes('localhost')
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
