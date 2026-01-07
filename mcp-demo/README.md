# MCP Date Demo

一個簡單的 MCP (Model Context Protocol) 伺服器示例，提供日期和時間查詢功能。

## 功能

- `get-date`: 獲取當前日期和時間，支援多種格式和時區
  - **format** (選填): 日期格式
    - `iso`: ISO 8601 格式 (預設)
    - `locale`: 本地化格式
    - `date-only`: 僅日期
    - `time-only`: 僅時間
    - `timestamp`: Unix 時間戳
  - **timezone** (選填): 時區 (例如: `Asia/Taipei`, `America/New_York`)

## 安裝

```bash
npm install
```

## 編譯

```bash
npm run build
```

## 使用方式

### 1. 在 Claude Code CLI 中使用

使用 `claude mcp add` 命令添加 MCP 服務器：

```bash
claude mcp add --transport stdio date-demo -- node /home/wuxinding/tim/demo/mcp-demo/dist/index.js
```

驗證配置：
```bash
claude mcp list
```

測試範例：
- "現在幾點？"
- "幫我查詢台北時間"
- "取得 ISO 格式的當前時間"
- "用 locale 格式顯示紐約現在的日期時間"

### 2. 在 Claude Desktop 中使用

編輯 Claude Desktop 配置文件：

- **MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

添加以下配置（請將路徑改為你的實際路徑）：

```json
{
  "mcpServers": {
    "date-demo": {
      "command": "node",
      "args": ["/home/wuxinding/tim/demo/mcp-demo/dist/index.js"]
    }
  }
}
```

### 3. 開發模式

```bash
npm run dev
```

### 4. 直接運行

```bash
npm start
```

## 項目結構

```
mcp-demo/
├── src/
│   └── index.ts          # MCP 伺服器主文件
├── dist/                 # 編譯後的文件
├── package.json          # 項目配置
├── tsconfig.json         # TypeScript 配置
└── README.md            # 說明文件
```

## 技術棧

- TypeScript
- Node.js
- @modelcontextprotocol/sdk
