<template>
  <div class="callback">
    <div v-if="error" class="error-message">
      <h2>登入失敗</h2>
      <p>{{ errorMessage }}</p>
      <button @click="goHome" class="home-button">返回首頁</button>
    </div>
    <div v-else class="loading">
      <div class="spinner"></div>
      <p>驗證成功，正在跳轉...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const error = ref(false)
const errorMessage = ref('')

onMounted(() => {
  // 從 URL 查詢參數中取得 token 或 error
  const token = route.query.token as string
  const errorParam = route.query.error as string

  if (errorParam) {
    // 處理錯誤情況
    error.value = true
    errorMessage.value = getErrorMessage(errorParam)
  } else if (token) {
    // 儲存 token 並重導向到 profile 頁面
    authStore.saveToken(token)
    router.push('/profile')
  } else {
    // 沒有 token 也沒有 error，重導向到首頁
    error.value = true
    errorMessage.value = '缺少必要的認證資訊'
  }
})

const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'authentication_failed': '認證失敗，請重試',
    'server_error': '伺服器錯誤，請稍後再試',
  }
  return errorMessages[errorCode] || '發生未知錯誤'
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.callback {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.loading {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  font-size: 18px;
  color: #666;
}

.error-message {
  text-align: center;
  padding: 20px;
}

.error-message h2 {
  color: #d32f2f;
  margin-bottom: 10px;
}

.error-message p {
  color: #666;
  margin-bottom: 20px;
}

.home-button {
  padding: 10px 20px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.home-button:hover {
  background-color: #357ae8;
}
</style>
