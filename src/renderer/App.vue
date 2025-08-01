<template>
  <div id="app">
    <div class="proxy-control">
      <h3>AnyProxy 代理控制</h3>
      <div class="status">
        状态: <span :class="status.running ? 'running' : 'stopped'">
          {{ status.running ? '运行中' : '已停止' }}
        </span>
        <span v-if="status.running">
          | 端口: {{ status.port }}
        </span>
      </div>
      <div class="actions">
        <button 
          @click="handleStart" 
          :disabled="status.running"
        >
          启动代理
        </button>
        <button 
          @click="handleStop" 
          :disabled="!status.running"
        >
          停止代理
        </button>
      </div>
      <div class="tips" v-if="!status.running">
        提示，如果启动后，无法获取请求，请检查端口占用情况。
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const status = ref({
  running: false,
  port: 8001
})

// 初始化状态
onMounted(async () => {
  updateStatus()
})

// 更新代理状态
const updateStatus = async () => {
  const currentStatus = await window.proxyAPI.getStatus()
  status.value = currentStatus
}

// 启动代理
const handleStart = async () => {
  const success = await window.proxyAPI.start()
  if (success) {
    alert('代理启动成功')
    updateStatus()
  } else {
    alert('代理启动失败，已经存在其他程序占用此服务....')
  }
}

// 停止代理
const handleStop = async () => {
  const success = await window.proxyAPI.stop()
  if (success) {
    alert('代理已停止')
    updateStatus()
  }
}
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

.proxy-control {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin: 20px;
}

.status {
  margin: 15px 0;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.running {
  color: #4CAF50;
  font-weight: bold;
}

.stopped {
  color: #f44336;
}

.actions {
  margin: 15px 0;
}

button {
  padding: 8px 16px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:first-of-type {
  background: #4CAF50;
  color: white;
}

button:last-of-type {
  background: #f44336;
  color: white;
}

.tips {
  color: #666;
  font-size: 14px;
  margin-top: 10px;
  padding: 10px;
  background: #fff8e1;
  border-radius: 4px;
}
</style>
