---
name: pinia-store-generator
description: 用於在 Vue 專案中生成 Pinia Store。當使用者要求建立全域狀態、Store 或 Data Service 時，應使用此技能。
---

# Pinia Store Generator

此技能協助生成遵循 Composition API 風格的 Pinia Store。

## 工作流程

1. **生成 Store**: 使用 `assets/pinia-store-template.ts` 作為樣板。
2. **檔案目錄**: 存放於 `src/stores/`。
3. **命名規則**:
   - `name`: 首字母大寫 (e.g., User)
   - `id`: 小寫/kebab-case (e.g., user)
   - 檔名: `[id].ts` (e.g., `user.ts`)

## 規範
- 必須使用 `defineStore`。
- 必須使用 `ref` 與 `computed` (Setup Store 風格)。
