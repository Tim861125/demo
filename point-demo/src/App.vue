<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";

// API 配置常量
const API_CONFIG = {
  url: "http://localhost:3000/api/user/get-user-detail-summary",
  userId: "08edb146-164a-4a8b-8eb7-9358690fd327",
  applicationName: "IPTech_STD",
  refreshInterval: 1000
};

// 響應式狀態
const userData = ref(null);
const autoRefresh = ref(false);
const loading = ref(false);
let intervalId = null;

// 獲取用戶資料
const fetchData = async () => {
  loading.value = true;
  try {
    const { data } = await axios.post(API_CONFIG.url, {
      userId: API_CONFIG.userId,
      applicationName: API_CONFIG.applicationName
    });
    userData.value = data.data;
  } catch (error) {
    console.error("獲取用戶資料失敗:", error);
    ElMessage.error("獲取資料失敗，請稍後再試");
  } finally {
    loading.value = false;
  }
};

// 清除定時器
const clearTimer = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// 監聽自動刷新開關
watch(autoRefresh, (enabled) => {
  if (enabled) {
    fetchData();
    intervalId = setInterval(fetchData, API_CONFIG.refreshInterval);
  } else {
    clearTimer();
  }
});

// 組件掛載時獲取初始資料
onMounted(fetchData);

// 組件卸載時清除定時器
onUnmounted(clearTimer);
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
      <el-button
        :disabled="autoRefresh"
        :loading="loading"
        @click="fetchData"
      >
        更新資料
      </el-button>
    </div>

    <el-card class="box-card" v-if="userData">
      <template #header>
        <div class="card-header">
          <span>點數詳情</span>
        </div>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用戶ID">
          {{ userData.userId }}
        </el-descriptions-item>
        <el-descriptions-item label="剩餘點數">
          {{ userData.remainingPoints }}
        </el-descriptions-item>
        <el-descriptions-item label="付費點數">
          {{ userData.paidPoints }}
        </el-descriptions-item>
        <el-descriptions-item label="贈送點數">
          {{ userData.giftedPoints }}
        </el-descriptions-item>
        <el-descriptions-item label="透支點數">
          {{ userData.overdraftPoints }}
        </el-descriptions-item>
        <el-descriptions-item label="最後使用功能">
          {{ userData.latestFeatureUsed }}
        </el-descriptions-item>
        <el-descriptions-item label="最後使用時間">
          {{ userData.latestFeatureUsedTime }}
        </el-descriptions-item>
        <el-descriptions-item label="最後扣點時間">
          {{ userData.lastDeductionTime }}
        </el-descriptions-item>
        <el-descriptions-item label="最後扣點點數">
          {{ userData.lastDeductionPoints }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <div class="skeleton-container" v-else>
      <el-skeleton :rows="10" animated />
    </div>
  </div>
</template>

<style>
/* Global styles */
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap");

body {
  background-color: #000a1f;
  color: #00f6ff;
  font-family: "Noto Sans TC", "Microsoft JhengHei", sans-serif;
  overflow-x: hidden;
}
</style>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  text-align: center;
  margin: 0 auto;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  text-shadow: 0 0 10px #00f6ff, 0 0 20px #00f6ff, 0 0 30px #00cfff;
  margin-bottom: 40px;
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
  max-width: 90%;
  background: rgba(13, 33, 66, 0.6);
  border: 1px solid #00f6ff;
  border-radius: 15px;
  box-shadow: inset 0 0 20px rgba(0, 246, 255, 0.2),
    0 0 20px rgba(0, 246, 255, 0.4);
  color: #fff;
  backdrop-filter: blur(5px);
  margin: 0 auto;
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
  font-family: "Noto Sans TC", "Microsoft JhengHei", sans-serif;
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
