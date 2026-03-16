---
name: vue-component-generator
description: 用於在 Vue 專案中生成符合規範的單檔案元件 (SFC)。當使用者要求建立新元件、樣板或 Vue 相關開發時，應使用此技能。
---

# Vue Component Generator

此技能可協助開發者快速生成並驗證 Vue 3 元件，特別是遵循 TypeScript 和 `<script setup>` 的開發風格。

## 功能與工作流程

### 1. 生成新元件
使用 `assets/vue-sfc-template.vue` 作為基礎樣板。
- **元件名稱**: 應使用 PascalCase。
- **檔案目錄**: 預設存放於 `src/components/`。
- **kebabName**: 元件的類別名稱應使用 kebab-case。

### 2. 驗證元件
在建立元件後，必須執行 `scripts/verify-component.cjs` 來確保元件符合規範。

#### 指令範例:
```bash
node scripts/verify-component.cjs src/components/MyNewComponent.vue
```

## 規範
- 必須使用 TypeScript (`lang="ts"`)。
- 必須使用 Composition API (`<script setup>`)。
- 必須包含 `<style scoped>`。

## 範例請求
- "幫我建立一個名為 MyButton 的 Vue 元件"
- "生成一個帶有 props 的新元件"
