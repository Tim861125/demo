<template>
  <div class="profile">
    <h1>個人資料</h1>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>載入中...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>載入個人資料失敗，請稍後再試。</p>
      <button @click="retry" class="retry-button">重試</button>
    </div>

    <div v-else-if="authStore.user" class="profile-content">
      <UserProfile :user="authStore.user" />

      <!-- <div class="actions">
        <router-link to="/" class="home-link">返回首頁</router-link>
        <button @click="handleLogout" class="logout-button">登出</button>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import UserProfile from "@/components/UserProfile.vue";

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const error = ref(false);

onMounted(async () => {
  // 如果 store 中沒有使用者資料，則獲取
  if (!authStore.user) {
    await fetchProfile();
  }
});

const fetchProfile = async () => {
  loading.value = true;
  error.value = false;

  try {
    await authStore.fetchUserProfile();
  } catch (err) {
    error.value = true;
    console.error("Failed to fetch profile:", err);
  } finally {
    loading.value = false;
  }
};

const retry = () => {
  fetchProfile();
};

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
}

h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.loading {
  text-align: center;
  padding: 50px 0;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading p {
  font-size: 18px;
  color: #666;
}

.error {
  text-align: center;
  padding: 50px 0;
}

.error p {
  color: #d32f2f;
  margin-bottom: 20px;
  font-size: 18px;
}

.retry-button {
  padding: 10px 20px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.retry-button:hover {
  background-color: #357ae8;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.home-link,
.logout-button {
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.home-link {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.home-link:hover {
  background-color: #e0e0e0;
}

.logout-button {
  background-color: #d32f2f;
  color: white;
  border: none;
}

.logout-button:hover {
  background-color: #b71c1c;
}
</style>
