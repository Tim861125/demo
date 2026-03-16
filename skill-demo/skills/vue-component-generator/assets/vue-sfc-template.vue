<script setup lang="ts">
/**
 * Component: {{ name }}
 * Description: [在這裡填寫描述]
 */

interface Props {
  /* 在這裡填寫 props */
}

const props = defineProps<Props>()

/* 在這裡填寫元件邏輯 */
</script>

<template>
  <div class="{{ kebabName }}">
    <!-- 在這裡填寫樣板 -->
    <h1>{{ name }}</h1>
  </div>
</template>

<style scoped>
.{{ kebabName }} {
  /* 在這裡填寫樣式 */
}
</style>
