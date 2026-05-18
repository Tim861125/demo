# shadcn-vue 在本專案帶進來的東西

整理 `shadcn-vue init` + `shadcn-vue add` 之後，專案裡哪些檔案、依賴是 shadcn-vue 的，哪些是你原本的。

---

## 1️⃣ 設定檔（CLI 自動生成）

| 檔案 | 由誰建立 | 用途 |
|------|---------|------|
| `components.json` | `shadcn-vue init` | 告訴 CLI 風格、顏色、路徑別名等設定 |
| `src/lib/utils.js` | `shadcn-vue init` | 提供 `cn()` 函數合併 Tailwind className |

---

## 2️⃣ 元件原始碼（`shadcn-vue add` 產生，**這是核心**）

`src/components/ui/` 整個資料夾都是：

```
src/components/ui/
├── button/        ← bunx shadcn-vue add button
│   ├── Button.vue       ← 元件本體
│   └── index.js         ← export Button + variants 定義
├── card/          ← bunx shadcn-vue add card（一次給 8 個檔）
│   ├── Card.vue
│   ├── CardHeader.vue
│   ├── CardTitle.vue
│   ├── CardDescription.vue
│   ├── CardContent.vue
│   ├── CardFooter.vue
│   ├── CardAction.vue
│   └── index.js
├── input/         ← bunx shadcn-vue add input
│   ├── Input.vue
│   └── index.js
└── label/         ← bunx shadcn-vue add label
    ├── Label.vue
    └── index.js
```

**這些 `.vue` 和 `.js` 是「你的程式碼」**——可以隨時改顏色、改 hover 效果、加新的 variant，跟改自己寫的元件沒兩樣。

---

## 3️⃣ CSS 設計 token（init 寫進你既有的 CSS）

**`src/assets/index.css`** 原本只有一行 `@import "tailwindcss";`，被 init 加了一堆東西：

```css
@import url('https://fonts.googleapis.com/css2?family=Inter...');  ← 字型
@import "tailwindcss";                                              ← 原本就有
@import "tw-animate-css";                                           ← 動畫
@custom-variant dark (&:is(.dark *));                               ← dark mode 規則
@theme inline { ... }                                               ← 把 CSS 變數映射成 Tailwind utility
:root { --primary, --background, --card, ... }                      ← 淺色設計 token
.dark { --primary, --background, --card, ... }                      ← 深色設計 token
@layer base { * { @apply border-border ... } }                      ← 基礎樣式
```

---

## 4️⃣ 自動安裝的 npm 依賴

`shadcn-vue init` 和 `add` 也會悄悄裝這些套件：

| 套件 | 用途 |
|------|------|
| **`reka-ui`** | shadcn-vue 的底層引擎，提供無樣式（headless）元件行為（焦點管理、鍵盤導航、無障礙） |
| **`class-variance-authority`** (cva) | 定義元件的變體系統（如 button 的 default/outline/ghost） |
| **`clsx`** | 條件式組合 className |
| **`tailwind-merge`** | 解決 Tailwind class 衝突（後面覆蓋前面） |
| **`lucide-vue-next`** | Lucide 圖標庫的 Vue 版本 |
| **`@vueuse/core`** | Vue Composition API 工具集（部分元件會用到） |
| **`tw-animate-css`** | Tailwind 動畫擴充（替代舊的 tailwindcss-animate） |

> `clsx` + `tailwind-merge` 合起來就是 `src/lib/utils.js` 的 `cn()` 函數實作。

---

## 一張圖總結：哪些是 shadcn-vue 的

```
vue-practice/
├── package.json              ⚠️ 多了 7 個依賴（見上表）
├── components.json           ✅ 純 shadcn-vue
├── src/
│   ├── assets/
│   │   └── index.css         ⚠️ 你原本的檔，被加了設計 token
│   ├── lib/
│   │   └── utils.js          ✅ 純 shadcn-vue（cn 函數）
│   ├── components/
│   │   └── ui/               ✅ 純 shadcn-vue（元件原始碼）
│   ├── main.js               ❌ 你的
│   └── App.vue               ❌ 你的（但有 import 元件）
├── index.html                ❌ 你的
├── vite.config.js            ❌ 你的（Tailwind plugin 是你手動加的）
└── jsconfig.json             ❌ 你的（為了 @ 別名）
```

**✅ 全是 shadcn-vue** ／ **⚠️ 被它改過** ／ **❌ 跟它無關**

---

## 如果想完全移除 shadcn-vue

```bash
# 1. 刪元件原始碼
rm -rf src/components/ui src/lib components.json

# 2. 刪相關依賴
bun remove reka-ui class-variance-authority clsx tailwind-merge \
           lucide-vue-next @vueuse/core tw-animate-css

# 3. 把 src/assets/index.css 還原成 `@import "tailwindcss";` 一行
```

`tailwindcss` / `@tailwindcss/vite` / `jsconfig.json` 是你自己加的（為了支援 shadcn-vue），但即使移除 shadcn-vue，這些保留下來也能繼續用 Tailwind。
