# vLLM Function Calling Client 規格文檔

## 目標

創建一個客戶端，將 MCP server 的工具定義轉換為 OpenAI function calling 格式，透過 vLLM 的 OpenAI-compatible API 呼叫本地模型，實現工具調用功能。

## 系統架構

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Client    │─────>│  vLLM API Server │─────>│   Model     │
│  (Node.js)  │<─────│  (192.168.1.63)  │<─────│   (Qwen3)   │
└─────────────┘      └──────────────────┘      └─────────────┘
       │
       │ 調用工具
       ▼
┌─────────────┐
│ Tool Execute│
│  (get-date) │
└─────────────┘
```

## vLLM API 配置

- **Base URL**: `http://192.168.1.63:30327`
- **Endpoint**: `/v1/chat/completions`
- **Model**: `cpatonn/Qwen3-30B-A3B-Instruct-2507-AWQ-4bit`
- **Protocol**: OpenAI-compatible API

## MCP Tool 到 OpenAI Function 的轉換

### MCP Tool 定義（現有）

```typescript
{
  name: "get-date",
  description: "Get the current date and time with optional formatting",
  inputSchema: {
    type: "object",
    properties: {
      format: {
        type: "string",
        description: "Date format: 'iso' (default), 'locale', 'date-only', 'time-only', or 'timestamp'",
        enum: ["iso", "locale", "date-only", "time-only", "timestamp"]
      },
      timezone: {
        type: "string",
        description: "Optional timezone (e.g., 'Asia/Taipei', 'America/New_York')"
      }
    },
    required: []
  }
}
```

### OpenAI Function 格式（目標）

```json
{
  "type": "function",
  "function": {
    "name": "get-date",
    "description": "Get the current date and time with optional formatting",
    "parameters": {
      "type": "object",
      "properties": {
        "format": {
          "type": "string",
          "description": "Date format: 'iso' (default), 'locale', 'date-only', 'time-only', or 'timestamp'",
          "enum": ["iso", "locale", "date-only", "time-only", "timestamp"]
        },
        "timezone": {
          "type": "string",
          "description": "Optional timezone (e.g., 'Asia/Taipei', 'America/New_York')"
        }
      },
      "required": []
    }
  }
}
```

## API 請求格式

### 基本請求（帶 Function Calling）

```json
{
  "model": "cpatonn/Qwen3-30B-A3B-Instruct-2507-AWQ-4bit",
  "messages": [
    {
      "role": "system",
      "content": "你是一個有用的助手，可以使用工具來回答問題。"
    },
    {
      "role": "user",
      "content": "現在是幾年幾月幾號？"
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get-date",
        "description": "Get the current date and time with optional formatting",
        "parameters": {
          "type": "object",
          "properties": {
            "format": {
              "type": "string",
              "enum": ["iso", "locale", "date-only", "time-only", "timestamp"]
            },
            "timezone": {
              "type": "string"
            }
          }
        }
      }
    }
  ],
  "tool_choice": "auto"
}
```

### 工具結果回傳請求

當模型返回 tool_calls 時，需要執行工具並將結果返回：

```json
{
  "model": "cpatonn/Qwen3-30B-A3B-Instruct-2507-AWQ-4bit",
  "messages": [
    {
      "role": "system",
      "content": "你是一個有用的助手，可以使用工具來回答問題。"
    },
    {
      "role": "user",
      "content": "現在是幾年幾月幾號？"
    },
    {
      "role": "assistant",
      "content": null,
      "tool_calls": [
        {
          "id": "call_abc123",
          "type": "function",
          "function": {
            "name": "get-date",
            "arguments": "{\"format\": \"date-only\"}"
          }
        }
      ]
    },
    {
      "role": "tool",
      "tool_call_id": "call_abc123",
      "content": "Current date/time: 1/7/2026"
    }
  ],
  "tools": [...],
  "tool_choice": "auto"
}
```

## 實現流程

### 1. 初始化階段

```
1. 載入 MCP 工具定義
2. 轉換為 OpenAI function 格式
3. 準備工具執行器映射表
```

### 2. 對話循環

```
循環直到完成：
  1. 發送請求到 vLLM API（包含 tools 定義）
  2. 接收響應
  3. 檢查響應類型：
     a. 如果是普通訊息 -> 返回給用戶，結束
     b. 如果包含 tool_calls -> 執行步驟 4
  4. 執行工具調用：
     a. 解析 tool_calls
     b. 查找對應的工具執行器
     c. 執行工具，獲取結果
     d. 構建 tool role 訊息
  5. 將對話歷史 + tool 結果繼續發送（回到步驟 1）
```

### 3. 工具執行

```typescript
function executeGetDate(args: { format?: string; timezone?: string }): string {
  const { format = "iso", timezone } = args;
  const now = new Date();

  switch (format) {
    case "iso":
      return now.toISOString();
    case "locale":
      return timezone
        ? now.toLocaleString("en-US", { timeZone: timezone })
        : now.toLocaleString();
    case "date-only":
      return timezone
        ? now.toLocaleDateString("en-US", { timeZone: timezone })
        : now.toLocaleDateString();
    case "time-only":
      return timezone
        ? now.toLocaleTimeString("en-US", { timeZone: timezone })
        : now.toLocaleTimeString();
    case "timestamp":
      return now.getTime().toString();
    default:
      return now.toISOString();
  }
}
```

## 檔案結構

```
src/
├── index.ts              # 現有的 MCP server
├── vllm-client.ts        # 新建：vLLM 客戶端主邏輯
├── tool-converter.ts     # 新建：MCP -> OpenAI 格式轉換
├── tool-executor.ts      # 新建：工具執行器
└── types.ts              # 新建：類型定義
```

## 核心模組規格

### tool-converter.ts

**職責**：將 MCP 工具定義轉換為 OpenAI function calling 格式

```typescript
interface MCPTool {
  name: string;
  description: string;
  inputSchema: object;
}

interface OpenAIFunction {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: object;
  };
}

function convertMCPToolToOpenAI(mcpTool: MCPTool): OpenAIFunction;
```

### tool-executor.ts

**職責**：執行工具調用並返回結果

```typescript
interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

interface ToolResult {
  role: "tool";
  tool_call_id: string;
  content: string;
}

async function executeTool(toolCall: ToolCall): Promise<ToolResult>;
```

### vllm-client.ts

**職責**：管理與 vLLM 的交互流程

```typescript
interface VLLMClientConfig {
  baseURL: string;
  model: string;
  systemPrompt?: string;
}

class VLLMClient {
  constructor(config: VLLMClientConfig);

  // 單次對話
  async chat(userMessage: string): Promise<string>;

  // 處理工具調用的完整流程
  private async sendRequest(messages: Message[], tools: OpenAIFunction[]): Promise<Response>;
  private async handleToolCalls(response: Response): Promise<Message[]>;
}
```

## 配置檔案

### config.json

```json
{
  "vllm": {
    "baseURL": "http://192.168.1.63:30327",
    "model": "cpatonn/Qwen3-30B-A3B-Instruct-2507-AWQ-4bit",
    "systemPrompt": "你是一個有用的助手，可以使用工具來回答問題。"
  },
  "tools": {
    "enabled": ["get-date"]
  }
}
```

## 使用範例

### 命令列模式

```bash
# 編譯
npm run build

# 執行客戶端
npm run client

# 或直接執行
node dist/vllm-client.js
```

### 交互範例

```
User: 現在是幾年幾月幾號？

[Client] 發送請求到 vLLM...
[Client] 模型返回 tool_call: get-date
[Client] 執行工具: get-date({"format": "date-only"})
[Client] 工具結果: 1/7/2026
[Client] 將結果返回給模型...
[Client] 模型最終回答: 今天是 2026 年 1 月 7 日。
```

## 錯誤處理

### 網路錯誤

```typescript
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
} catch (error) {
  console.error("Failed to connect to vLLM server:", error);
  // 實現重試邏輯或返回錯誤訊息給用戶
}
```

### 工具執行錯誤

```typescript
try {
  const result = executeTool(toolCall);
  return {
    role: "tool",
    tool_call_id: toolCall.id,
    content: result
  };
} catch (error) {
  return {
    role: "tool",
    tool_call_id: toolCall.id,
    content: `Error executing tool: ${error.message}`
  };
}
```

### JSON 解析錯誤

模型返回的 `arguments` 可能格式不正確：

```typescript
try {
  const args = JSON.parse(toolCall.function.arguments);
} catch (error) {
  console.error("Failed to parse tool arguments:", toolCall.function.arguments);
  return {
    role: "tool",
    tool_call_id: toolCall.id,
    content: "Error: Invalid arguments format"
  };
}
```

## 依賴套件

需要添加以下依賴：

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.4"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "typescript": "^5.7.2"
  }
}
```

注意：不需要額外的 HTTP 客戶端函式庫，使用 Node.js 內建的 `fetch` API（Node.js 18+）

## package.json 更新

添加新的執行腳本：

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "start": "node dist/index.js",
    "client": "node dist/vllm-client.js"
  }
}
```

## 開發步驟

### Phase 1: 基礎設施

1. 創建 `src/types.ts` - 定義所有類型介面
2. 創建 `src/tool-converter.ts` - 實現格式轉換
3. 創建測試用例驗證轉換正確性

### Phase 2: 工具執行

1. 創建 `src/tool-executor.ts` - 實現 get-date 工具
2. 支援參數解析和驗證
3. 添加錯誤處理

### Phase 3: vLLM 整合

1. 創建 `src/vllm-client.ts` - 實現 API 呼叫
2. 實現對話循環邏輯
3. 處理 tool_calls 響應

### Phase 4: 測試和優化

1. 創建簡單的 CLI 交互介面
2. 測試完整流程
3. 添加日誌和除錯訊息
4. 效能優化（如果需要）

## 測試用例

### 測試 1: 基本日期查詢

**輸入**: "現在是幾年幾月幾號？"

**期望**:
1. 模型調用 `get-date` 工具
2. 使用合適的格式（如 `date-only`）
3. 返回正確的日期

### 測試 2: 帶時區的查詢

**輸入**: "紐約現在幾點？"

**期望**:
1. 模型調用 `get-date` 工具
2. 參數包含 `timezone: "America/New_York"`
3. 參數包含 `format: "time-only"` 或 `"locale"`

### 測試 3: 多輪對話

**輸入**:
- "現在是幾點？"
- "那台北呢？"

**期望**:
1. 第一次調用 `get-date`
2. 模型理解上下文，第二次調用時加上台北時區

### 測試 4: 錯誤處理

**輸入**: 使用無效的時區

**期望**:
1. 工具執行時捕獲錯誤
2. 返回友善的錯誤訊息
3. 模型向用戶解釋問題

## 注意事項

### vLLM Function Calling 支援

確認你的 vLLM 服務和模型支援 function calling：
- vLLM 版本需要 >= 0.4.0
- 模型需要訓練過 function calling（如 Qwen2.5-Instruct 系列）

### 模型提示詞

如果模型不能正確使用工具，嘗試優化 system prompt：

```
你是一個有用的助手。當用戶詢問時間、日期相關問題時，你必須使用 get-date 工具來獲取準確的資訊，而不是猜測或使用訓練資料中的資訊。
```

### Tool Choice 選項

- `"auto"`: 讓模型決定是否使用工具（推薦）
- `"required"`: 強制模型使用工具
- `{"type": "function", "function": {"name": "get-date"}}`: 強制使用特定工具

### 效能考慮

- 每次 tool call 都需要額外的 API 往返
- 對於簡單查詢，考慮設置逾時
- 快取工具定義以避免重複轉換

## 擴展可能性

### 添加更多工具

按照相同模式添加新工具：

```typescript
// 在 tool-converter.ts 中添加工具定義
const tools = [
  getDateTool,
  weatherTool,     // 新工具
  calculatorTool   // 新工具
];

// 在 tool-executor.ts 中添加執行邏輯
switch (toolCall.function.name) {
  case "get-date":
    return executeGetDate(args);
  case "get-weather":
    return executeWeather(args);
  case "calculate":
    return executeCalculator(args);
}
```

### 整合外部 API

工具可以呼叫外部服務：

```typescript
async function executeWeather(args: { location: string }): Promise<string> {
  const response = await fetch(`https://api.weather.com/...`);
  const data = await response.json();
  return JSON.stringify(data);
}
```

### 持久化對話歷史

儲存對話歷史以支援多輪對話：

```typescript
class VLLMClient {
  private conversationHistory: Message[] = [];

  async chat(userMessage: string): Promise<string> {
    this.conversationHistory.push({
      role: "user",
      content: userMessage
    });

    // ... 處理邏輯 ...

    this.conversationHistory.push(assistantMessage);
  }
}
```

## 參考資料

- [OpenAI Function Calling API](https://platform.openai.com/docs/guides/function-calling)
- [vLLM OpenAI-Compatible Server](https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Qwen Models Function Calling](https://qwen.readthedocs.io/en/latest/framework/function_call.html)
