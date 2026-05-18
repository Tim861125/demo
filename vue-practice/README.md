# Vue Practice — 最小化 Vue 3 + Vite + Bun 專案

這是一個「能跑起來的最小 Vue 專案」，只有 **5 個原始檔案**。本 README 說明每個檔案的職責，以及它們之間如何串接。

## 啟動方式

```bash
bun install      # 安裝依賴
bun run dev      # 啟動開發伺服器 http://localhost:5173
bun run build    # 打包到 dist/
bun run preview  # 預覽打包後的結果
```

## 檔案結構

```
vue-practice/
├── package.json        ← 專案宣告：依賴、scripts
├── index.html          ← 瀏覽器載入的入口 HTML
├── vite.config.js      ← Vite 設定，註冊 Vue 編譯器
├── src/
│   ├── main.js         ← JS 入口，建立 Vue app 並掛載
│   └── App.vue         ← 根組件
├── bun.lock            ← (自動產生) 鎖定依賴版本
└── node_modules/       ← (自動產生) 已安裝的套件
```

---

## 各檔案說明

### 1. `package.json` — 專案宣告

定義專案名稱、依賴、以及指令別名。

- `"type": "module"`：讓 Node/Vite 把 `.js` 視為 ES Module，這樣才能在 `vite.config.js` 用 `import`。
- `dependencies.vue`：執行期需要的 Vue 核心。
- `devDependencies`：
  - `vite`：開發伺服器 + 打包工具。
  - `@vitejs/plugin-vue`：把 `.vue` 單檔組件（SFC）編譯成 JS 的外掛。
- `scripts`：`bun run dev / build / preview` 對應的實際指令。

### 2. `index.html` — 瀏覽器入口

**Vite 把 HTML 當作專案入口**（不像傳統的 webpack 把 JS 當入口），瀏覽器第一個載入的就是這個檔。

- `<div id="app"></div>`：Vue 會把整個應用「掛載」到這個空容器裡。
- `<script type="module" src="/src/main.js">`：載入 JS 入口，由 Vite 在 dev 模式下即時編譯。

### 3. `vite.config.js` — Vite 設定

告訴 Vite 「遇到 `.vue` 檔要用 `@vitejs/plugin-vue` 處理」。

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
```

沒有這個檔，Vite 不認得 `.vue` 檔，會直接報錯。

### 4. `src/main.js` — JS 入口

整個應用程式的起點，只做一件事：建立 Vue app 並掛到 `#app` 上。

```js
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

如果未來要加 router、pinia、全域樣式，都是在這裡 `app.use(...)` 註冊。

### 5. `src/App.vue` — 根組件

Vue 的「單檔組件（Single-File Component, SFC）」，把一個組件的三個部份寫在同一個檔案裡：

```vue
<script setup>
// 邏輯：state、function、import
</script>

<template>
  <!-- 畫面：HTML 模板 -->
</template>

<style scoped>
/* 樣式：只作用於此組件 */
</style>
```

`<script setup>` 是 Vue 3 的 Composition API 語法糖，宣告的變數會自動暴露給 template 使用。

---

## 載入流程

```
瀏覽器
  └─ 載入 index.html
       └─ <script src="/src/main.js">
            └─ import App from './App.vue'   ← Vite 透過 plugin-vue 即時編譯
                 └─ createApp(App).mount('#app')
                      └─ Vue 接管 <div id="app">，渲染畫面
```

---

## 自動產生的檔案

- **`bun.lock`**：執行 `bun install` 後產生，鎖定每個依賴的實際版本，應該**提交到 git**。
- **`node_modules/`**：依賴的實體檔案，**不提交**（用 `.gitignore` 排除）。
