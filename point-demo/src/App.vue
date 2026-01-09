<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";

// API 配置常量
const API_CONFIG = {
  url: "http://localhost:3000/api/user/get-user-detail-summary",
  userId: "08edb146-164a-4a8b-8eb7-9358690fd327",
  applicationName: "IPTech_STD",
  refreshInterval: 1000,
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
      applicationName: API_CONFIG.applicationName,
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
    <div class="header">
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
    </div>

    <template v-if="userData">
      <div class="grid-container">
        <!-- 左側：點數詳情 -->
        <el-card class="box-card grid-item left-panel">
          <template #header>
            <div class="card-header">
              <span>點數詳情</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
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

        <!-- 右上：Latest Reply Record -->
        <el-card class="box-card grid-item">
          <template #header>
            <div class="card-header">
              <span>Latest Reply Record</span>
            </div>
          </template>
          <pre class="json-content">{{
            JSON.stringify(userData.latestReplyRecord, null, 2)
          }}</pre>
        </el-card>

        <!-- 右下：Latest Transaction + Latest Transaction Detail -->
        <el-card class="box-card grid-item">
          <template #header>
            <div class="card-header">
              <span>Latest Transaction</span>
            </div>
          </template>
          <pre class="json-content">{{
            JSON.stringify(userData.latestTransaction, null, 2)
          }}</pre>

          <div class="divider"></div>

          <div class="sub-header">Latest Transaction Detail</div>
          <pre class="json-content">{{
            JSON.stringify(userData.latestTransactionDetail, null, 2)
          }}</pre>
        </el-card>
      </div>
    </template>

    <div class="skeleton-container" v-else>
      <el-skeleton :rows="10" animated />
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  background: #f5f5f5;
}

#app {
  height: 100%;
  width: 100%;
}
</style>

<style scoped>
.container {
  height: 100vh;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 100%;
}

.header {
  text-align: center;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.controls {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
  flex: 1;
  min-height: 0;
}

.grid-item {
  min-height: 0;
  overflow: hidden;
}

.left-panel {
  grid-row: 1 / 3;
}

.box-card {
  height: 100%;
  width: 650px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.el-card__header) {
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  padding: 12px 16px;
  font-weight: 600;
  color: #333;
}

:deep(.el-card__body) {
  height: calc(100% - 49px);
  overflow-y: auto;
  padding: 16px;
}

.json-content {
  background: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 12px;
  font-family: "Courier New", monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  overflow-x: auto;
  white-space: pre;
}

.divider {
  height: 1px;
  background: #e8e8e8;
  margin: 16px 0;
}

.sub-header {
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
  font-size: 14px;
}

.skeleton-container {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 滾動條樣式 */
:deep(.el-card__body)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

:deep(.el-card__body)::-webkit-scrollbar-track {
  background: #f1f1f1;
}

:deep(.el-card__body)::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

:deep(.el-card__body)::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
