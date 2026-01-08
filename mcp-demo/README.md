# MCP Date Demo

一個完整的 MCP (Model Context Protocol) 示例項目，包含伺服器和客戶端實現，提供日期和時間查詢功能，並展示如何與 VLLM 整合進行工具調用。

**使用 Bun 運行** - 無需編譯，直接運行 TypeScript 代碼，開發更快速！

## 功能特性

### MCP 伺服器 (src/index.ts)

- **工具**: `get-date` - 獲取當前日期和時間，支援多種格式和時區
  - **format** (選填): 日期格式
    - `iso`: ISO 8601 格式 (預設)
    - `locale`: 本地化格式
    - `date-only`: 僅日期
    - `time-only`: 僅時間
    - `timestamp`: Unix 時間戳
  - **timezone** (選填): 時區 (例如: `Asia/Taipei`, `America/New_York`)

### MCP 客戶端 (src/mcp-client.ts)

提供通用的 MCP 客戶端實現，可用於連接和調用 MCP 伺服器：
- `create(command, args)`: 創建並連接到 MCP 伺服器
- `listTools()`: 列出伺服器提供的所有工具
- `callTool(name, args)`: 調用指定的工具
- `disconnect()`: 斷開連接並終止伺服器進程

### VLLM 測試客戶端 (src/vllm-client.ts)

展示如何整合 MCP 與大型語言模型 (VLLM)：
- 連接到 VLLM API 端點
- 將 MCP 工具轉換為 OpenAI Function Calling 格式
- 實現工具調用循環 (agentic loop)
- 管理對話歷史
- 支持原生和文本解析兩種工具調用方式

## 安裝

```bash
bun install
```

## 快速開始

Bun 可直接運行 TypeScript，無需編譯：

```bash
# 開發模式（支援自動重載，推薦）
bun dev

# 或直接運行
bun start
```

## 使用方式

### 1. 在 Claude Code CLI 中使用

使用 `claude mcp add` 命令添加 MCP 服務器：

```bash
claude mcp add --transport stdio date-demo -- bun run /home/wuxinding/tim/demo/mcp-demo/src/index.ts
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
      "command": "bun",
      "args": ["run", "/home/wuxinding/tim/demo/mcp-demo/src/index.ts"]
    }
  }
}
```

### 3. 運行 VLLM 測試客戶端

```bash
bun client
```

此命令會啟動 VLLM 客戶端，展示如何使用 MCP 工具與 LLM 進行對話和工具調用。

### 4. 使用 MCP 客戶端 (程式化調用)

在您的 TypeScript/JavaScript 代碼中使用：

```typescript
import { MCPClient } from './mcp-client.js';

// 創建並連接到 MCP 伺服器（使用 bun）
const client = await MCPClient.create('bun', ['run', 'src/index.ts']);

// 列出可用工具
const tools = await client.listTools();
console.log('可用工具:', tools);

// 調用工具
const result = await client.callTool('get-date', {
  format: 'locale',
  timezone: 'Asia/Taipei'
});
console.log('結果:', result);

// 斷開連接
await client.disconnect();
```

## 項目結構

```
mcp-demo/
├── src/
│   ├── index.ts          # MCP 伺服器主文件
│   ├── mcp-client.ts     # MCP 客戶端實現
│   ├── vllm-client.ts    # VLLM 測試客戶端
│   └── types.ts          # TypeScript 類型定義
├── dist/                 # 編譯後的文件
├── package.json          # 項目配置
├── tsconfig.json         # TypeScript 配置
├── CLAUDE.md             # Claude Code 開發指南
├── GEMINI.md             # Gemini Code Assistant 上下文
├── SpecV3.md             # 工作流程圖文檔
└── README.md             # 說明文件
```

### 文件說明

- **src/index.ts**: MCP 日期時間伺服器的主要實現，提供 `get-date` 工具
- **src/mcp-client.ts**: 通用 MCP 客戶端類，用於連接和調用 MCP 伺服器
- **src/vllm-client.ts**: VLLM 整合示例，展示如何將 MCP 工具與 LLM 結合
- **src/types.ts**: 共用的 TypeScript 類型定義
- **CLAUDE.md**: 為 Claude Code 提供的項目上下文和開發指導

## 技術棧

- **Bun**: 快速的 JavaScript 運行時，支援直接運行 TypeScript
- **TypeScript 5.7.2**: 強類型語言，提供完整的類型安全
- **@modelcontextprotocol/sdk**: 官方 MCP SDK
- **ES Modules**: 使用現代 JavaScript 模組系統
- **JSON-RPC 2.0**: MCP 通訊協議

## 開發特性

- ✅ 使用 Bun 直接運行 TypeScript，無需編譯
- ✅ TypeScript 嚴格模式，確保類型安全
- ✅ 完整的 MCP 伺服器和客戶端實現
- ✅ 支援 stdio 傳輸協議
- ✅ 工具調用循環 (Tool calling loop) 示例
- ✅ VLLM/OpenAI Function Calling 整合
- ✅ 完整的錯誤處理和日誌記錄
- ✅ 支援多種日期時間格式
- ✅ 時區感知的時間處理
- ✅ Watch 模式開發支援，自動重載

## 依賴項

### 生產環境
- `@modelcontextprotocol/sdk` (^1.0.4): 官方 Node.js MCP SDK

### 開發環境
- `@types/node` (^22.10.2): Node.js 類型定義
- `typescript` (^5.7.2): TypeScript 編譯器

## 進階使用

### 自定義 VLLM 端點

編輯 `src/vllm-client.ts` 中的配置：

```typescript
const VLLM_API_BASE = "http://your-vllm-server:port";
const MODEL = "your-model-name";
```

### 擴展工具

在 `src/index.ts` 中添加新工具：

1. 在 `ListToolsRequestSchema` 處理器中添加工具定義
2. 在 `CallToolRequestSchema` 處理器中添加工具實現
3. 若使用 `bun dev`，修改會自動重載；否則重啟伺服器即可

## 許可證

MIT
