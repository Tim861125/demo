# Obsidian MCP Server

這是一個基於 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) 的伺服器，讓 AI (如 Claude) 能夠存取、搜尋並讀取您的 Obsidian 筆記。

使用 **Bun** 與 **TypeScript** 實作。

## 功能特色 (Tools)

- `search_notes`: 透過關鍵字搜尋筆記檔名或內容。
- `read_note`: 讀取特定筆記的完整 Markdown 內容。
- `list_recent_notes`: 列出最近修改過的筆記。

## 安裝與設定

### 1. 前置作業
確保您的系統已安裝 [Bun](https://bun.sh/)。

### 2. 環境變數設定
在專案目錄下建立 `.env` 檔案（或修改現有的）：
```env
OBSIDIAN_VAULT_PATH=/home/wuxinding/GoogleDrive/ObsidianVault
```

### 3. 安裝依賴
```bash
bun install
```

## 如何與 AI 工具整合

### Claude Desktop 配置
開啟 Claude Desktop 的設定檔：
- **Linux/macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

加入以下 MCP 伺服器配置：

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "bun",
      "args": ["run", "/home/wuxinding/tim/demo/obsidian-mcp/src/index.ts"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/home/wuxinding/GoogleDrive/ObsidianVault"
      }
    }
  }
}
```

## 開發與測試

### 本地執行
```bash
bun run src/index.ts
```

### 使用 MCP Inspector 測試
您可以啟動一個網頁介面來測試工具是否正常運作：
```bash
npx @modelcontextprotocol/inspector bun run src/index.ts
```

## 安全性說明
本伺服器包含路徑安全檢查，確保 AI 只能讀取 `OBSIDIAN_VAULT_PATH` 目錄下的 `.md` 檔案，無法存取系統其他敏感位置。
