# radix-demo

Bun + Vue 3 + TypeScript + [radix-vue](https://www.radix-vue.com/) + Tailwind CSS v4 範例頁面，展示 Tabs、Switch、Dialog 三個 Radix 原語。

## 需求

- [Bun](https://bun.sh) 1.3+

## 快速啟動

```bash
bun install
bun dev
```

打開瀏覽器到 [http://localhost:5173](http://localhost:5173) 即可看到頁面。

## 其他指令

```bash
bun run build     # 產出 production bundle 到 dist/
bun run preview   # 在本地預覽 production build
```

## 專案結構

```
src/
├── App.vue       # 主頁面，含 Tabs / Switch / Dialog 範例
├── main.ts       # Vue app 入口
└── style.css     # Tailwind v4 入口 + 全域樣式
vite.config.ts    # 註冊 vue 與 @tailwindcss/vite 插件
```

## 技術棧

| 套件 | 用途 |
| --- | --- |
| Bun | 套件管理 + 執行器 |
| Vite | Dev server + 打包 |
| Vue 3 (`<script setup>`) | 框架 |
| radix-vue | 無樣式、可組合的可及性原語 |
| Tailwind CSS v4 | 樣式（透過 `@tailwindcss/vite` 插件） |
