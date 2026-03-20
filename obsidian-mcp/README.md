# Obsidian MCP Server

讓 Claude Desktop 與 Claude Code 能夠直接存取、搜尋並讀取您的 Obsidian 筆記。

## 可用工具

| 工具 | 說明 |
|------|------|
| `search_notes` | 以關鍵字搜尋筆記檔名或內容 |
| `read_note` | 讀取指定筆記的完整內容 |
| `list_recent_notes` | 列出最近修改的筆記 |

---

## 快速開始

**前置需求**：安裝 [Bun](https://bun.sh/)

```bash
cd /path/to/obsidian-mcp
bun install
```

---

## 整合 Claude Desktop

### 1. 找到設定檔位置

| 平台 | 路徑 |
|------|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

### 2. 編輯設定檔

用任何文字編輯器開啟設定檔，加入以下內容：

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "bun",
      "args": ["run", "/path/to/obsidian-mcp/index.ts"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/your/ObsidianVault"
      }
    }
  }
}
```

> 替換說明：
> - `/path/to/obsidian-mcp/index.ts`：本專案 `index.ts` 的絕對路徑
> - `/path/to/your/ObsidianVault`：您 Obsidian Vault 資料夾的絕對路徑

**macOS 範例：**

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "bun",
      "args": ["run", "/Users/yourname/projects/obsidian-mcp/index.ts"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/Users/yourname/Documents/ObsidianVault"
      }
    }
  }
}
```

**Linux 範例：**

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "bun",
      "args": ["run", "/home/yourname/projects/obsidian-mcp/index.ts"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/home/yourname/ObsidianVault"
      }
    }
  }
}
```

若設定檔原本已有其他 MCP 伺服器，在 `mcpServers` 物件內新增 `obsidian` 欄位即可：

```json
{
  "mcpServers": {
    "existing-server": { "..." },
    "obsidian": {
      "command": "bun",
      "args": ["run", "/path/to/obsidian-mcp/index.ts"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/your/ObsidianVault"
      }
    }
  }
}
```

### 3. 重新啟動 Claude Desktop

儲存設定後，完全關閉並重新啟動 Claude Desktop。

### 4. 確認連線

重啟後，在對話視窗底部工具列應可看到 Obsidian 工具圖示。您可以輸入：

```
列出我最近修改的 5 篇 Obsidian 筆記
```

若工具正常運作即代表整合成功。

---

## 整合 Claude Code (CLI)

### 方法一：使用 `claude mcp add` 指令（推薦）

```bash
claude mcp add obsidian \
  --env OBSIDIAN_VAULT_PATH=/path/to/your/ObsidianVault \
  -- bun run /path/to/obsidian-mcp/index.ts
```

此指令會將設定寫入 Claude Code 的設定檔，之後每次啟動 `claude` 都會自動載入。

**實際範例：**

```bash
claude mcp add obsidian \
  --env OBSIDIAN_VAULT_PATH=/home/yourname/ObsidianVault \
  -- bun run /home/yourname/projects/obsidian-mcp/index.ts
```

### 方法二：直接編輯設定檔

Claude Code 的 MCP 設定位於：

```
~/.claude/settings.json
```

在 `mcpServers` 欄位加入：

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "bun",
      "args": ["run", "/path/to/obsidian-mcp/index.ts"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/your/ObsidianVault"
      }
    }
  }
}
```

### 確認與管理

```bash
# 列出所有已設定的 MCP
claude mcp list

# 移除 obsidian MCP
claude mcp remove obsidian
```

在 `claude` 互動介面內輸入 `/mcp` 可查看目前啟用的 MCP 伺服器狀態。

### 使用範例

啟動 Claude Code 後，直接用自然語言操作 Obsidian 筆記：

| 動作 | 範例提示 |
|------|---------|
| 搜尋筆記 | 「搜尋 Obsidian 裡關於 'MCP' 的筆記」 |
| 讀取筆記 | 「讀取 Daily/2024-03-20.md 這篇筆記」 |
| 最近筆記 | 「列出最近修改的 5 篇筆記」 |

---

## 測試與除錯

### 本地執行測試

```bash
OBSIDIAN_VAULT_PATH=/path/to/your/ObsidianVault bun run index.ts
```

### 使用 MCP Inspector 測試

```bash
OBSIDIAN_VAULT_PATH=/path/to/your/ObsidianVault bun run inspector
# 或
OBSIDIAN_VAULT_PATH=/path/to/your/ObsidianVault npx @modelcontextprotocol/inspector bun run index.ts
```

開啟瀏覽器後可透過 Inspector 介面直接測試三個工具是否正常運作。

### 常見問題

**Q：Claude Desktop 看不到 Obsidian 工具**

1. 確認 `bun` 已安裝：`which bun`
2. 確認路徑皆為絕對路徑（不可使用 `~` 或相對路徑）
3. 確認 `OBSIDIAN_VAULT_PATH` 資料夾存在
4. 確認 JSON 格式正確（可用 [JSON Lint](https://jsonlint.com/) 驗證）
5. 完全關閉並重新啟動 Claude Desktop

**Q：搜尋結果為空**

確認 `OBSIDIAN_VAULT_PATH` 指向的是 Vault 根目錄（包含 `.obsidian` 資料夾的那層）。
