import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const use{{ name }}Store = defineStore('{{ id }}', () => {
  // State
  const count = ref(0)

  // Getters
  const doubleCount = computed(() => count.value * 2)

  // Actions
  function increment() {
    count.value++
  }

  return {
    count,
    doubleCount,
    increment
  }
})
