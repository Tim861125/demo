<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import axios from "axios";

// 使用 ref 来创建响应式变量
const userData = ref(null);
const autoRefresh = ref(false);
const loading = ref(false);
let intervalId = null;

// 定义获取数据的方法
const fetchData = async () => {
  loading.value = true;
  try {
    const response = await axios.post(
      "http://localhost:3000/api/user/get-user-detail-summary",
      {
        userId: "08edb146-164a-4a8b-8eb7-9358690fd327",
        applicationName: "IPTech_STD"
      }
    );
    userData.value = response.data.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    // 在这里可以处理错误，例如显示一个错误消息
  } finally {
    loading.value = false;
  }
};

// 使用 watch 监听 autoRefresh 的变化
watch(autoRefresh, (newValue) => {
  if (newValue) {
    // 如果开启了自动刷新，立即执行一次，然后设置定时器
    fetchData();
    intervalId = setInterval(fetchData, 1000);
  } else {
    // 如果关闭了自动刷新，清除定时器
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
});

// 在组件挂载时获取一次数据
onMounted(() => {
  fetchData();
});

// 在组件卸载时清除定时器，防止内存泄漏
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <div class="container">
    <h1>用戶點數資訊</h1>

    <div class="controls">
      <el-switch
        v-model="autoRefresh"
        active-text="每秒自動更新"
        inactive-text="手動更新"
      />
      <el-button :disabled="autoRefresh" @click="fetchData" :loading="loading">
        {{ loading ? "更新中..." : "更新資料" }}
      </el-button>
    </div>

    <el-card class="box-card" v-if="userData">
      <template #header>
        <div class="card-header">
          <span>點數詳情</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用戶ID">{{
          userData.userId
        }}</el-descriptions-item>
        <el-descriptions-item label="剩餘點數">{{
          userData.remainingPoints
        }}</el-descriptions-item>
        <el-descriptions-item label="付費點數">{{
          userData.paidPoints
        }}</el-descriptions-item>
        <el-descriptions-item label="贈送點數">{{
          userData.giftedPoints
        }}</el-descriptions-item>
        <el-descriptions-item label="透支點數">{{
          userData.overdraftPoints
        }}</el-descriptions-item>
        <el-descriptions-item label="最後使用功能">{{
          userData.latestFeatureUsed
        }}</el-descriptions-item>
        <el-descriptions-item label="最後使用時間">{{
          userData.latestFeatureUsedTime
        }}</el-descriptions-item>
        <el-descriptions-item label="最後扣點時間">{{
          userData.lastDeductionTime
        }}</el-descriptions-item>
        <el-descriptions-item label="最後扣點點數">{{
          userData.lastDeductionPoints
        }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <div class="skeleton-container" v-else>
      <el-skeleton :rows="10" animated />
    </div>
  </div>
</template>

<style>
/* Global styles */
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");

body {
  background-color: #000a1f;
  color: #00f6ff;
  font-family: "Orbitron", sans-serif;
  overflow-x: hidden;
}
</style>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  text-align: center;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  text-shadow: 0 0 10px #00f6ff, 0 0 20px #00f6ff, 0 0 30px #00cfff;
  margin-bottom: 40px;
  animation: flicker 1.5s infinite alternate;
}

@keyframes flicker {
  0%,
  18%,
  22%,
  25%,
  53%,
  57%,
  100% {
    text-shadow: 0 0 4px #00f6ff, 0 0 11px #00f6ff, 0 0 19px #00f6ff,
      0 0 40px #00cfff, 0 0 80px #00cfff, 0 0 90px #00cfff, 0 0 100px #00cfff,
      0 0 150px #00cfff;
  }
  20%,
  24%,
  55% {
    text-shadow: none;
  }
}

.controls {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 24px;
  background: rgba(13, 33, 66, 0.4);
  padding: 15px 25px;
  border-radius: 15px;
  border: 1px solid #00f6ff;
  box-shadow: 0 0 15px rgba(0, 246, 255, 0.3);
}

.box-card,
.skeleton-container {
  width: 100%;
  max-width: 1400px;
  background: rgba(13, 33, 66, 0.6);
  border: 1px solid #00f6ff;
  border-radius: 15px;
  box-shadow: inset 0 0 20px rgba(0, 246, 255, 0.2),
    0 0 20px rgba(0, 246, 255, 0.4);
  color: #fff;
  backdrop-filter: blur(5px);
}
.skeleton-container {
  padding: 20px;
}

:deep(.el-card__header) {
  border-bottom: 1px solid rgba(0, 246, 255, 0.5);
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 0 8px #00f6ff;
}

:deep(.el-descriptions) {
  background: transparent;
  --el-descriptions-table-border: 1px solid rgba(0, 246, 255, 0.3);
  --el-fill-color-light: rgba(13, 33, 66, 0.5);
}

:deep(.el-descriptions-item__label) {
  color: #00f6ff !important;
  font-weight: 700;
  background: rgba(13, 33, 66, 0.4) !important;
  text-shadow: 0 0 5px #00f6ff;
}

:deep(.el-descriptions-item__content) {
  color: #e0e0e0;
}

:deep(.el-switch__label) {
  color: #a7d8ff;
  text-shadow: 0 0 3px rgba(0, 246, 255, 0.5);
}
:deep(.el-switch__label.is-active) {
  color: #00f6ff;
}

:deep(.el-switch__core) {
  background-color: #1a3a6e;
}

:deep(.el-switch.is-checked .el-switch__core) {
  background-color: #00f6ff;
  border-color: #00f6ff;
}

:deep(.el-button) {
  background-color: transparent;
  border: 1px solid #00f6ff;
  color: #00f6ff;
  font-family: "Orbitron", sans-serif;
  transition: all 0.3s ease;
}

:deep(.el-button:hover),
:deep(.el-button:focus) {
  background-color: rgba(0, 246, 255, 0.15);
  box-shadow: 0 0 12px rgba(0, 246, 255, 0.6);
  color: #fff;
  border-color: #fff;
}

:deep(.el-button:disabled) {
  background-color: rgba(26, 58, 110, 0.3);
  border-color: rgba(0, 246, 255, 0.2);
  color: rgba(0, 246, 255, 0.4);
  cursor: not-allowed;
}
:deep(.el-button:disabled:hover) {
  box-shadow: none;
}

:deep(.el-skeleton) {
  --el-skeleton-color: rgba(26, 58, 110, 0.5);
  --el-skeleton-to-color: rgba(13, 33, 66, 0.7);
}
</style>
