import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const accessToken = ref<string | null>(null)
  const user = ref<User | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!accessToken.value)

  // 初始化：從 localStorage 載入 token
  const initAuth = () => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      accessToken.value = storedToken
    }
  }

  // Actions
  const login = () => {
    // 重導向到後端的 OAuth 授權 URL
    window.location.href = 'http://localhost:3000/auth/login'
  }

  const saveToken = (token: string) => {
    accessToken.value = token
    localStorage.setItem('token', token)
  }

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/api/profile')
      user.value = response.data.user
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      throw error
    }
  }

  const logout = () => {
    accessToken.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    // State
    accessToken,
    user,
    // Computed
    isAuthenticated,
    // Actions
    initAuth,
    login,
    saveToken,
    fetchUserProfile,
    logout
  }
})
