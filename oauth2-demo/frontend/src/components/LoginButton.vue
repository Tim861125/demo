<template>
  <button @click="handleLogin" class="login-button">
    使用 Google 登入
  </button>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleLogin = () => {
  authStore.login()
}
</script>

<style scoped>
.login-button {
  padding: 12px 24px;
  font-size: 16px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #357ae8;
}
</style>
