# Vue Practice — Vue 3 + Vite + Bun + shadcn-vue

一個從零開始的 Vue 3 專案，搭配 **Bun**、**Vite**、**Tailwind CSS v4** 與 **shadcn-vue** 元件庫，內含一個簡單的登入表單示範。

## 快速啟動

```bash
bun install
bun run dev          # http://localhost:5173
bun run build        # 打包到 dist/
bun run preview      # 預覽打包結果
```

---

## Part 1 — 最小 Vue 3 專案（5 個檔案）

最一開始只用 5 個手寫檔就能跑起 Vue：

| 檔案 | 用途 |
|------|------|
| `package.json` | 依賴與 scripts |
| `index.html` | Vite 入口 HTML，掛載點 `<div id="app">` |
| `vite.config.js` | 啟用 `@vitejs/plugin-vue` |
| `src/main.js` | `createApp(App).mount('#app')` |
| `src/App.vue` | 根組件 |

載入流程：

```
index.html → /src/main.js → import App.vue → mount('#app')
```

---

## Part 2 — 安裝 shadcn-vue

### 為什麼選 shadcn-vue

跟 Element Plus、Naive UI 這類**套件型**元件庫不同，shadcn-vue 是**把元件原始碼複製進你的專案**——你完全擁有並可修改每個元件，底層是 Tailwind CSS + Reka UI（無樣式 headless 元件）。

### 操作步驟（依序執行）

#### 步驟 1：安裝 Tailwind CSS v4

```bash
bun add tailwindcss @tailwindcss/vite
```

#### 步驟 2：更新 `vite.config.js`

加入 Tailwind plugin 與 `@` 路徑別名（shadcn-vue 元件用 `@/components/ui/...` 形式 import）。

```js
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

#### 步驟 3：建立 `jsconfig.json`

讓編輯器（VSCode 等）認得 `@/*` 別名。

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "exclude": ["node_modules", "dist"]
}
```

#### 步驟 4：建立 Tailwind 入口 CSS

```bash
mkdir -p src/assets
echo '@import "tailwindcss";' > src/assets/index.css
```

#### 步驟 5：執行 shadcn-vue init

```bash
bunx --bun shadcn-vue@latest init \
  --base reka \
  --icon-library lucide \
  --base-color neutral \
  --font inter \
  --force --yes
```

> **遇到的坑**：CLI 預設會寫入 `style: "reka-vega"`，但目前 registry 只接受 `default` 或 `new-york`。如果看到「The item at ... was not found」錯誤，手動把 `components.json` 的 `style` 改成 `"new-york"` 再重跑 init。

init 完成後會自動產生：
- `components.json`：shadcn-vue 設定
- `src/lib/utils.js`：`cn()` className 合併工具
- 並把設計 token（顏色、radius、dark mode 變數）寫進 `src/assets/index.css`

#### 步驟 6：加入元件

```bash
bunx --bun shadcn-vue@latest add button card input label --yes
```

每個元件會被複製到 `src/components/ui/<元件名>/`，**原始碼就是你的**，可任意修改。

#### 步驟 7：在 `src/main.js` 引入 CSS

```js
import { createApp } from 'vue'
import './assets/index.css'
import App from './App.vue'

createApp(App).mount('#app')
```

#### 步驟 8：在 `App.vue` 使用元件

```vue
<script setup>
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
</script>

<template>
  <Card>
    <CardHeader><CardTitle>Hello</CardTitle></CardHeader>
    <CardContent>
      <Label for="email">Email</Label>
      <Input id="email" />
      <Button>送出</Button>
    </CardContent>
  </Card>
</template>
```

---

## 本專案示範

`src/App.vue` 實作了一個登入表單卡片，示範以下功能：

- ✅ **Card / CardHeader / CardTitle / CardContent / CardFooter**：卡片佈局
- ✅ **Input + Label**：搭配 `v-model` 雙向綁定
- ✅ **Button** 三種 variant：`default`、`outline`、`ghost`
- ✅ **disabled 狀態**：表單未填妥時送出鈕停用（`computed` 計算）
- ✅ **Dark mode 切換**：點右上角按鈕切換 `<html>` 的 `.dark` class
- ✅ **送出回饋區塊**：使用 `bg-muted` / `border-border` 等設計 token

---

## 完整檔案結構

```
vue-practice/
├── package.json
├── bun.lock                  (自動產生)
├── node_modules/             (自動產生)
├── index.html
├── vite.config.js
├── jsconfig.json             ← 路徑別名 @/*
├── components.json           ← shadcn-vue 設定
├── README.md
└── src/
    ├── main.js
    ├── App.vue               ← 示範頁面
    ├── assets/
    │   └── index.css         ← Tailwind + 設計 token
    ├── lib/
    │   └── utils.js          ← cn() className 工具
    └── components/
        └── ui/               ← shadcn-vue 元件原始碼
            ├── button/
            ├── card/
            ├── input/
            └── label/
```

---

## 常見後續操作

### 加更多元件

到 [shadcn-vue.com/docs/components](https://www.shadcn-vue.com/docs/components.html) 看可用清單，例如：

```bash
bunx --bun shadcn-vue@latest add dialog dropdown-menu select toast
```

### 改顏色主題

編輯 `src/assets/index.css` 裡的 `:root { --primary: ... }` 等 CSS 變數，所有元件會同步變色。

### 切到深色模式

在 `<html>` 加上 `class="dark"`（本專案右上角按鈕的做法）。

---

## 技術棧版本

| 工具 | 版本 |
|------|------|
| Bun | 1.3+ |
| Vue | 3.5 |
| Vite | 6.4 |
| Tailwind CSS | 4.3 |
| shadcn-vue | latest（Reka UI 為底） |
| Icons | Lucide |
