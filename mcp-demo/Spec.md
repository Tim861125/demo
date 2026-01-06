# MCP Add Demo 技術規格

## 架構概述

這是一個基於 Model Context Protocol (MCP) 的簡單加法服務器實現。

## 系統架構圖

```mermaid
graph TB
    subgraph Client["Claude Code CLI (客戶端)"]
        User[用戶輸入: 計算 5 + 3]
        Claude[Claude AI]
        ToolManager[工具管理器]
    end

    subgraph Transport["傳輸層 (stdio)"]
        stdin[標準輸入 stdin]
        stdout[標準輸出 stdout]
    end

    subgraph Server["MCP Server (add-demo)"]
        ServerCore[Server Core]
        ListHandler[ListTools Handler]
        CallHandler[CallTool Handler]
        AddTool[Add Tool Logic]
    end

    User -->|"請求計算"| Claude
    Claude -->|"查詢可用工具"| ToolManager
    ToolManager -->|"tools/list"| stdin
    stdin --> ServerCore
    ServerCore --> ListHandler
    ListHandler -->|"返回工具清單"| stdout
    stdout --> ToolManager

    ToolManager -->|"選擇 add 工具"| Claude
    Claude -->|"tools/call"| stdin
    stdin --> ServerCore
    ServerCore --> CallHandler
    CallHandler --> AddTool
    AddTool -->|"計算結果"| CallHandler
    CallHandler -->|"返回結果"| stdout
    stdout --> Claude
    Claude -->|"顯示答案"| User

    style User fill:#e1f5ff
    style Claude fill:#fff4e1
    style ServerCore fill:#ffe1f5
    style AddTool fill:#e1ffe1
```

## MCP 通信流程時序圖

```mermaid
sequenceDiagram
    autonumber
    participant U as 用戶
    participant C as Claude AI
    participant T as Transport (stdio)
    participant S as MCP Server

    Note over U,S: 初始化階段
    U->>C: "計算 5 + 3"
    C->>T: tools/list 請求
    T->>S: 轉發請求
    S->>T: 返回工具清單<br/>[{ name: "add", schema: {...} }]
    T->>C: 工具清單

    Note over U,S: 工具調用階段
    C->>C: 分析用戶意圖<br/>決定使用 add(a=5, b=3)
    C->>T: tools/call<br/>{ name: "add", args: { a: 5, b: 3 } }
    T->>S: 轉發調用請求

    Note over S: 執行加法運算
    S->>S: result = 5 + 3 = 8

    S->>T: 返回結果<br/>{ content: [{ type: "text", text: "5 + 3 = 8" }] }
    T->>C: 計算結果
    C->>U: "結果是 8"
```

## 數據流圖

```mermaid
flowchart LR
    subgraph Input["輸入"]
        A[用戶請求]
    end

    subgraph Processing["處理流程"]
        B[Claude 解析意圖]
        C[查詢工具清單]
        D[選擇合適工具]
        E[構造參數]
        F[調用 MCP Server]
        G[執行 add 函數]
        H[格式化結果]
    end

    subgraph Output["輸出"]
        I[返回給用戶]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I

    style A fill:#e1f5ff
    style G fill:#e1ffe1
    style I fill:#ffe1e1
```

## 工具定義結構

```mermaid
classDiagram
    class MCPServer {
        +name: string
        +version: string
        +capabilities: Capabilities
        +setRequestHandler()
        +connect()
    }

    class Tool {
        +name: string
        +description: string
        +inputSchema: JSONSchema
    }

    class JSONSchema {
        +type: "object"
        +properties: Properties
        +required: string[]
    }

    class Properties {
        +a: NumberProperty
        +b: NumberProperty
    }

    class Request {
        +method: string
        +params: Params
    }

    class Response {
        +content: Content[]
    }

    class Content {
        +type: "text"
        +text: string
    }

    MCPServer "1" --> "*" Tool
    Tool "1" --> "1" JSONSchema
    JSONSchema "1" --> "1" Properties
    Request --> Response
    Response "1" --> "*" Content
```

## 狀態機圖

```mermaid
stateDiagram-v2
    [*] --> Initializing: 啟動服務器
    Initializing --> Idle: 連接成功

    Idle --> ListingTools: 收到 tools/list
    ListingTools --> Idle: 返回工具清單

    Idle --> CallingTool: 收到 tools/call
    CallingTool --> Validating: 驗證參數

    Validating --> Executing: 參數有效
    Validating --> Error: 參數無效

    Executing --> Idle: 返回結果
    Error --> Idle: 返回錯誤

    Idle --> [*]: 關閉服務器
```

## 核心組件說明

### 1. Server 初始化
- 創建 Server 實例
- 聲明 capabilities（能力）
- 設置 Request Handlers

### 2. Transport Layer
- **類型**: stdio (標準輸入/輸出)
- **協議**: JSON-RPC 2.0
- **通信方式**: 雙向流式通信

### 3. Request Handlers
- **ListToolsRequestSchema**: 返回可用工具列表
- **CallToolRequestSchema**: 執行工具調用

### 4. Tool Schema
使用 JSON Schema 定義工具參數：
```json
{
  "type": "object",
  "properties": {
    "a": { "type": "number", "description": "第一個數字" },
    "b": { "type": "number", "description": "第二個數字" }
  },
  "required": ["a", "b"]
}
```

## 錯誤處理

```mermaid
flowchart TD
    A[收到工具調用請求] --> B{工具名稱是否存在?}
    B -->|否| C[拋出 Unknown tool 錯誤]
    B -->|是| D{參數是否有效?}
    D -->|否| E[TypeScript 類型錯誤]
    D -->|是| F[執行加法運算]
    F --> G[返回結果]

    C --> H[返回錯誤給客戶端]
    E --> H

    style C fill:#ffcccc
    style E fill:#ffcccc
    style G fill:#ccffcc
```

## 技術規格

| 項目 | 說明 |
|------|------|
| **協議** | Model Context Protocol (MCP) |
| **傳輸層** | stdio |
| **數據格式** | JSON |
| **編程語言** | TypeScript |
| **運行時** | Node.js |
| **SDK** | @modelcontextprotocol/sdk |

## API 端點

### 1. ListTools
**請求**:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 1
}
```

**響應**:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "tools": [
      {
        "name": "add",
        "description": "Add two numbers together and return the result",
        "inputSchema": {
          "type": "object",
          "properties": {
            "a": { "type": "number" },
            "b": { "type": "number" }
          },
          "required": ["a", "b"]
        }
      }
    ]
  },
  "id": 1
}
```

### 2. CallTool
**請求**:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "add",
    "arguments": {
      "a": 5,
      "b": 3
    }
  },
  "id": 2
}
```

**響應**:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "The sum of 5 + 3 = 8"
      }
    ]
  },
  "id": 2
}
```

## 擴展性設計

### 添加新工具的步驟

```mermaid
flowchart LR
    A[1. 定義工具 Schema] --> B[2. 在 ListTools 中註冊]
    B --> C[3. 在 CallTool 中處理]
    C --> D[4. 實現業務邏輯]
    D --> E[5. 返回結果]

    style A fill:#e1f5ff
    style E fill:#e1ffe1
```

### 示例：添加減法工具

```typescript
// 1. 在 ListTools 中添加
tools: [
  { name: "add", ... },
  {
    name: "subtract",
    description: "Subtract b from a",
    inputSchema: {
      type: "object",
      properties: {
        a: { type: "number" },
        b: { type: "number" }
      },
      required: ["a", "b"]
    }
  }
]

// 2. 在 CallTool 中處理
if (request.params.name === "subtract") {
  const { a, b } = request.params.arguments;
  return {
    content: [{ type: "text", text: `${a} - ${b} = ${a - b}` }]
  };
}
```

## 安全考量

```mermaid
mindmap
  root((MCP 安全))
    輸入驗證
      參數類型檢查
      必填欄位驗證
      數值範圍限制
    錯誤處理
      捕獲異常
      友好錯誤消息
      避免洩漏敏感信息
    進程隔離
      stdio 本地通信
      不暴露網絡端口
      沙箱執行
    權限控制
      最小權限原則
      工具訪問控制
```

## 性能指標

| 指標 | 目標值 |
|------|--------|
| 工具調用延遲 | < 10ms |
| 內存使用 | < 50MB |
| 啟動時間 | < 1s |
| 並發請求處理 | 順序處理（stdio 特性） |

## 參考資源

- [MCP 官方文檔](https://modelcontextprotocol.io)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol/sdk)
- [JSON Schema 規範](https://json-schema.org)
