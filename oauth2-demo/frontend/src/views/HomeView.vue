<template>
  <div class="home">
    <h1>OAuth 2.0 demo</h1>

    <div v-if="!authStore.isAuthenticated" class="login-section">
      <p>登入以查看您的個人資料。</p>
      <LoginButton />
    </div>

    <div v-else class="welcome-section">
      <p>歡迎回來！您已成功登入。</p>
      <router-link to="/profile" class="profile-link">
        前往個人資料頁面
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import LoginButton from "@/components/LoginButton.vue";

const authStore = useAuthStore();
</script>

<style scoped>
.home {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}

h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 30px;
}

.login-section,
.welcome-section {
  margin-top: 30px;
}

.login-section p,
.welcome-section p {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}

.profile-link {
  display: inline-block;
  padding: 12px 24px;
  background-color: #4285f4;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.profile-link:hover {
  background-color: #357ae8;
}
</style>
