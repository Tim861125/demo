<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <h1>Hello Vue 3 + Vite + Bun</h1>
  <button @click="count++">count is {{ count }}</button>
</template>
