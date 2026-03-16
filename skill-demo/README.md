# Skill Demo Project (Vue 3 + Bun + Gemini Skill)

這是一個使用 **Bun** 管理的 **Vue 3 (TypeScript + Vite)** 示範專案，主要用於練習與展示如何實作並使用 **Gemini CLI Skills**。

## 🚀 技術棧

- **框架:** Vue 3 (Composition API + `<script setup>`)
- **語言:** TypeScript
- **建置工具:** Vite
- **套件管理:** Bun
- **AI 助手:** Gemini CLI (with Custom Skills)

## 📦 安裝與啟動

1. **安裝依賴:**
   ```bash
   bun install
   ```

2. **啟動開發伺服器:**
   ```bash
   bun dev
   ```

3. **專案檢查 (Type-check):**
   ```bash
   bun run type-check
   ```

---

## 🤖 Gemini CLI Skills

專案內包含以下預先實作的 Skills：

### 1. `vue-component-generator`
- **功能**: 生成符合規範的 Vue 單檔案元件 (SFC)。
- **觸發**: 「幫我建立一個名為 `AppHeader` 的 Vue 元件」。

### 2. `pinia-store-generator`
- **功能**: 生成符合 Composition API 風格的 Pinia Store。
- **觸發**: 「幫我建立一個名為 `User` 的 Pinia Store」。

### 3. `vitest-generator`
- **功能**: 為 Vue 元件生成 Vitest 單元測試。
- **觸發**: 「幫我為 `MyButton` 元件建立一個單元測試」。

### 如何安裝與啟用
在當前專案目錄下執行以下指令：
```bash
gemini skills install vue-component-generator.skill --scope workspace
gemini skills install pinia-store-generator.skill --scope workspace
gemini skills install vitest-generator.skill --scope workspace
```

安裝完成後，在 Gemini CLI 互動視窗中執行：
```bash
/skills reload
```

### 4. Skill 原始碼結構
- `skills/vue-component-generator/SKILL.md`: Skill 的指令與描述文件。
- `skills/vue-component-generator/assets/vue-sfc-template.vue`: 生成元件時使用的樣板。
- `skills/vue-component-generator/scripts/verify-component.cjs`: 用於自動驗證生成的元件是否符合 TS + `<script setup>` 規範的腳本。

---

## 🛠️ 如何自行修改或打包 Skill

如果您修改了 `skills/vue-component-generator/` 下的內容，需要重新打包才能生效：

```bash
node /home/wuxinding/.local/share/fnm/node-versions/v20.20.0/installation/lib/node_modules/@google/gemini-cli/node_modules/@google/gemini-cli-core/dist/src/skills/builtin/skill-creator/scripts/package_skill.cjs ./skills/vue-component-generator
```
*(路徑請根據您的系統環境調整)*
