<script setup lang="ts">
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const isDark = ref(false);
function toggleTheme() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
}

const count = ref(0);

const features = [
  {
    icon: "ri-palette-line",
    title: "可客製主題",
    description: "用 CSS 變數定義 design tokens,輕鬆切換暗黑模式與品牌色。",
  },
  {
    icon: "ri-stack-line",
    title: "Copy & Paste",
    description: "元件原始碼直接寫在你的專案內,完全可控、零黑盒。",
  },
  {
    icon: "ri-flashlight-line",
    title: "無障礙優先",
    description: "底層基於 Reka UI,鍵盤導航與 ARIA 一應俱全。",
  },
];

const themeLabel = computed(() => (isDark.value ? "亮色模式" : "暗黑模式"));
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Nav -->
    <header
      class="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur"
    >
      <div
        class="container flex h-14 items-center justify-between max-w-5xl mx-auto px-6"
      >
        <div class="flex items-center gap-2 font-semibold">
          <span
            class="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs"
          >
            sv
          </span>
          <span>shadcn-vue demo</span>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" @click="toggleTheme">
            <i :class="isDark ? 'ri-sun-line' : 'ri-moon-line'" />
            {{ themeLabel }}
          </Button>
          <Button as="a" href="https://www.shadcn-vue.com" target="_blank" size="sm">
            文件
          </Button>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="container max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
      <Badge variant="secondary" class="mb-6">v1.0 · 試玩</Badge>
      <h1
        class="font-heading text-5xl md:text-6xl font-bold tracking-tight leading-tight"
      >
        用 <span class="text-primary">shadcn-vue</span><br />
        打造優雅的介面
      </h1>
      <p class="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
        一組可複製貼上、可完整客製的 Vue 元件庫。基於 Tailwind CSS 與 Reka UI,
        為你的下一個專案提供堅實的設計基礎。
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg">
          開始使用
          <i class="ri-arrow-right-line" />
        </Button>
        <Button size="lg" variant="outline">
          <i class="ri-github-fill" />
          GitHub
        </Button>
      </div>

      <div class="mt-12 inline-flex items-center gap-3 rounded-full border bg-card px-5 py-2 text-sm">
        <span class="text-muted-foreground">互動計數:</span>
        <Button variant="ghost" size="icon-sm" @click="count = Math.max(0, count - 1)">
          <i class="ri-subtract-line" />
        </Button>
        <span class="font-mono w-6 text-center font-medium">{{ count }}</span>
        <Button variant="ghost" size="icon-sm" @click="count++">
          <i class="ri-add-line" />
        </Button>
      </div>
    </section>

    <!-- Features -->
    <section class="container max-w-5xl mx-auto px-6 pb-24">
      <div class="grid gap-6 md:grid-cols-3">
        <Card v-for="f in features" :key="f.title" class="transition hover:shadow-md hover:-translate-y-0.5">
          <CardHeader>
            <div
              class="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground"
            >
              <i :class="f.icon" class="text-lg" />
            </div>
            <CardTitle>{{ f.title }}</CardTitle>
            <CardDescription>{{ f.description }}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <!-- CTA Card -->
      <Card class="mt-12">
        <CardHeader>
          <CardTitle>準備好開始了嗎?</CardTitle>
          <CardDescription>
            執行 <code class="rounded bg-muted px-1.5 py-0.5 text-sm">bunx shadcn-vue add &lt;component&gt;</code>
            把元件複製進你的專案。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2">
            <Badge>Vue 3</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
            <Badge variant="secondary">Reka UI</Badge>
            <Badge variant="outline">TypeScript</Badge>
          </div>
        </CardContent>
        <CardFooter class="flex gap-3">
          <Button>查看所有元件</Button>
          <Button variant="ghost">關於本專案</Button>
        </CardFooter>
      </Card>
    </section>

    <footer class="border-t">
      <div
        class="container max-w-5xl mx-auto px-6 py-6 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2"
      >
        <span>© 2026 shadcn-vue demo</span>
        <span>Built with Vue + Vite + Tailwind</span>
      </div>
    </footer>
  </div>
</template>
