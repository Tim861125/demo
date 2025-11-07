<template>
  <div class="user-profile">
    <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="avatar" />
    <div class="user-info">
      <h2>{{ user.name }}</h2>
      <p class="email">{{ user.email }}</p>
      <p class="user-id">ID: {{ user.id }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/stores/auth'

defineProps<{
  user: User
}>()
</script>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  max-width: 500px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-info h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #333;
}

.email {
  margin: 4px 0;
  color: #666;
  font-size: 16px;
}

.user-id {
  margin: 4px 0;
  color: #999;
  font-size: 14px;
}
</style>
