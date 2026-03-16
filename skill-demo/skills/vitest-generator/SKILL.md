---
name: vitest-generator
description: 用於為 Vue 元件生成 Vitest 單元測試。當使用者要求建立測試、測試案例或測試相關內容時，應使用此技能。
---

# Vitest Generator

此技能協助生成遵循 Vitest 與 `@vue/test-utils` 規範的測試檔案。

## 工作流程

1. **生成測試檔案**: 使用 `assets/vitest-template.spec.ts` 作為樣板。
2. **檔案目錄**: 預設存放於 `src/__tests__/` 或與元件同層。
3. **檔名規則**: `[ComponentName].spec.ts`。

## 規範
- 必須包含 `mount` 方法。
- 必須包含 `describe` 與 `it` 結構。
- 必須測試元件是否正確渲染 (wrapper.exists())。
