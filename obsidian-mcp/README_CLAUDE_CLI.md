# Obsidian MCP Server — Claude Code 整合指南

## 快速開始

### 1. 安裝依賴

```bash
cd /home/wuxinding/tim/demo/obsidian-mcp
bun install
```

### 2. 將 MCP 加入 Claude Code

```bash
claude mcp add obsidian \
  --env OBSIDIAN_VAULT_PATH=/home/wuxinding/GoogleDrive/ObsidianVault \
  -- bun run /home/wuxinding/tim/demo/obsidian-mcp/index.ts
```

> 請將路徑替換為您實際的 Vault 路徑與專案路徑。

### 3. 啟動 Claude Code

```bash
claude
```

---

## 可用指令示例

| 動作 | 範例提示 |
|------|---------|
| 搜尋筆記 | 「搜尋 Obsidian 裡關於 'MCP' 的筆記」 |
| 讀取筆記 | 「讀取 Daily/2024-03-20.md 這篇筆記」 |
| 最近筆記 | 「列出最近修改的 5 篇筆記」 |

---

## MCP 管理

```bash
claude mcp list           # 列出所有設定
claude mcp remove obsidian  # 移除設定
```

在 Claude 互動介面內輸入 `/mcp` 可查看目前啟用的 MCP 伺服器。
