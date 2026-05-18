<script setup>
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const email = ref('')
const password = ref('')
const submitted = ref(null)
const isDark = ref(false)

const canSubmit = computed(() => email.value && password.value.length >= 6)

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

function handleSubmit() {
  submitted.value = { email: email.value, time: new Date().toLocaleTimeString() }
}

function reset() {
  email.value = ''
  password.value = ''
  submitted.value = null
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
    <div class="w-full max-w-md space-y-4">
      <div class="flex justify-end">
        <Button variant="outline" size="sm" @click="toggleDark">
          {{ isDark ? '☀️ Light' : '🌙 Dark' }}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>登入帳號</CardTitle>
          <CardDescription>
            這是 shadcn-vue 元件示範頁面（Button / Card / Input / Label）。
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div class="space-y-2">
            <Label for="password">密碼</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="至少 6 個字元"
            />
          </div>

          <div
            v-if="submitted"
            class="rounded-md border border-border bg-muted p-3 text-sm"
          >
            ✅ 已送出：<strong>{{ submitted.email }}</strong>
            <span class="text-muted-foreground">（{{ submitted.time }}）</span>
          </div>
        </CardContent>

        <CardFooter class="flex gap-2">
          <Button class="flex-1" :disabled="!canSubmit" @click="handleSubmit">
            登入
          </Button>
          <Button variant="ghost" @click="reset">清除</Button>
        </CardFooter>
      </Card>

      <p class="text-center text-xs text-muted-foreground">
        Vue 3 + Vite + Bun + shadcn-vue
      </p>
    </div>
  </div>
</template>
