# MCP Demo 工作流程圖

本文檔包含 MCP Demo 項目的各種流程圖，使用 Mermaid 格式繪製。

## 1. 系統架構圖

```mermaid
graph TB
    subgraph "用戶端"
        User[用戶]
        VLLMClient[VLLM Client<br/>vllm-client.ts]
    end

    subgraph "MCP 層"
        MCPClient[MCP Client<br/>mcp-client.ts]
        MCPServer[MCP Server<br/>index.ts]
    end

    subgraph "外部服務"
        VLLM[VLLM API Server<br/>大型語言模型]
    end

    subgraph "工具層"
        DateTool[get-date Tool<br/>日期時間工具]
    end

    User -->|查詢| VLLMClient
    VLLMClient -->|HTTP Request| VLLM
    VLLM -->|Tool Calls| VLLMClient
    VLLMClient -->|執行工具| MCPClient
    MCPClient -->|stdio<br/>JSON-RPC| MCPServer
    MCPServer -->|調用| DateTool
    DateTool -->|結果| MCPServer
    MCPServer -->|回傳| MCPClient
    MCPClient -->|工具結果| VLLMClient
    VLLMClient -->|最終回答| User

    style VLLMClient fill:#e1f5ff
    style MCPClient fill:#fff4e1
    style MCPServer fill:#e8f5e9
    style VLLM fill:#f3e5f5
    style DateTool fill:#fff9c4
```

## 2. VLLM Client 初始化流程

```mermaid
sequenceDiagram
    participant Main as main()
    participant VC as VLLMClient
    participant MC as MCPClient
    participant MS as MCP Server

    Main->>VC: VLLMClient.create(config)
    activate VC

    VC->>MC: MCPClient.create("node", ["./dist/index.js"])
    activate MC

    MC->>MC: 創建 StdioClientTransport
    MC->>MS: spawn 子進程
    activate MS
    MS-->>MC: 進程啟動
    MC->>MS: client.connect(transport)
    MS-->>MC: 連接成功

    deactivate MS
    MC-->>VC: MCPClient 實例
    deactivate MC

    VC->>MC: listTools()
    activate MC
    MC->>MS: ListToolsRequest
    activate MS
    MS-->>MC: tools 列表
    deactivate MS
    MC-->>VC: MCP Tools
    deactivate MC

    VC->>VC: convertMCPToolToOpenAI(tools)
    VC->>VC: 初始化 conversation history
    VC->>VC: 添加 system prompt

    VC-->>Main: VLLMClient 實例
    deactivate VC

    Note over Main,MS: 初始化完成，準備處理用戶查詢
```

## 3. 對話和工具調用主流程

```mermaid
flowchart TD
    Start([用戶發送消息]) --> AddUserMsg[將用戶消息加入<br/>conversation history]
    AddUserMsg --> InitLoop{開始對話循環<br/>maxIterations = 5}

    InitLoop --> SendReq[發送請求到 VLLM API<br/>包含 tools 和 messages]

    SendReq --> GetResp[接收 VLLM 響應]

    GetResp --> CheckResp{響應中有<br/>choices?}
    CheckResp -->|否| Error1[拋出錯誤:<br/>No response]

    CheckResp -->|是| ExtractMsg[提取 assistant message]

    ExtractMsg --> CheckToolCall{有 tool_calls?}

    CheckToolCall -->|否| CheckContent{有 content?}

    CheckContent -->|是| ParseText{嘗試解析<br/>文本中的 tool call}

    ParseText -->|找到 tool call| SetToolCall[設置 tool_calls<br/>清空 content]
    SetToolCall --> AddAssistMsg

    ParseText -->|未找到| AddAssistMsg[將 assistant message<br/>加入 history]

    CheckToolCall -->|是| AddAssistMsg

    AddAssistMsg --> HasToolCall{message 有<br/>tool_calls?}

    HasToolCall -->|是| HandleTools[處理工具調用<br/>handleToolCalls]
    HandleTools --> AddToolResults[將工具結果<br/>加入 history]
    AddToolResults --> CheckIter{還有剩餘<br/>迭代次數?}

    CheckIter -->|是| SendReq
    CheckIter -->|否| Error2[拋出錯誤:<br/>Max iterations reached]

    HasToolCall -->|否| CheckFinalContent{有 content?}

    CheckFinalContent -->|是| Return[返回 content<br/>作為最終答案]
    CheckFinalContent -->|否| Error3[拋出錯誤:<br/>No content and no tool calls]

    Return --> End([結束])
    Error1 --> End
    Error2 --> End
    Error3 --> End

    style Start fill:#e1f5ff
    style Return fill:#c8e6c9
    style End fill:#c8e6c9
    style Error1 fill:#ffcdd2
    style Error2 fill:#ffcdd2
    style Error3 fill:#ffcdd2
    style HandleTools fill:#fff9c4
```

## 4. 工具調用處理流程

```mermaid
sequenceDiagram
    participant VC as VLLMClient
    participant MC as MCPClient
    participant MS as MCP Server
    participant Tool as get-date Tool

    Note over VC: 收到含 tool_calls 的<br/>assistant message

    VC->>VC: handleToolCalls(assistantMessage)

    loop 每個 tool_call
        VC->>VC: 解析 tool call arguments

        VC->>MC: callTool(name, args)
        activate MC

        MC->>MS: CallToolRequest<br/>{name, arguments}
        activate MS

        MS->>MS: 驗證 tool name

        alt tool 是 get-date
            MS->>Tool: 執行 get-date 邏輯
            activate Tool
            Tool->>Tool: 解析 format 參數
            Tool->>Tool: 解析 timezone 參數
            Tool->>Tool: 生成日期時間字串
            Tool-->>MS: 日期時間結果
            deactivate Tool
        else 未知 tool
            MS->>MS: 拋出錯誤
        end

        MS-->>MC: {content: [{type: "text", text: result}]}
        deactivate MS

        MC-->>VC: content[0] (text result)
        deactivate MC

        VC->>VC: 創建 tool result message<br/>{role: "tool", tool_call_id, content}
    end

    VC->>VC: 將所有 tool results<br/>加入 conversation history

    Note over VC: 準備下一輪 VLLM 請求
```

## 5. MCP Client 工具調用詳細流程

```mermaid
flowchart TD
    Start([callTool被調用]) --> PrepareReq[準備 CallToolRequest<br/>{name, arguments}]

    PrepareReq --> SendReq[client.callTool<br/>發送到 MCP Server]

    SendReq --> WaitResp[等待響應<br/>透過 stdio]

    WaitResp --> RecvResp[接收響應]

    RecvResp --> ExtractContent[提取 response.content]

    ExtractContent --> GetFirst[返回 content[0]<br/>作為結果]

    GetFirst --> End([結束])

    style Start fill:#e1f5ff
    style SendReq fill:#fff4e1
    style End fill:#c8e6c9
```

## 6. 文本工具調用解析流程

```mermaid
flowchart TD
    Start([檢查 assistant.content]) --> HasContent{content<br/>存在?}

    HasContent -->|否| NoToolCall[返回 null]

    HasContent -->|是| Regex[使用正則表達式匹配<br/>&lt;tool_call&gt;...&lt;/tool_call&gt;]

    Regex --> Found{找到<br/>匹配?}

    Found -->|否| NoToolCall

    Found -->|是| ExtractJSON[提取 JSON 內容]

    ExtractJSON --> ParseJSON{JSON.parse<br/>成功?}

    ParseJSON -->|失敗| LogError[記錄錯誤]
    LogError --> NoToolCall

    ParseJSON -->|成功| CreateToolCall[創建 ToolCall 對象<br/>{id, type, function}]

    CreateToolCall --> GenID[生成 ID:<br/>call_timestamp]

    GenID --> SetFields[設置 name 和 arguments]

    SetFields --> Return[返回 ToolCall]

    NoToolCall --> End([結束: null])
    Return --> End2([結束: ToolCall])

    style Start fill:#e1f5ff
    style Return fill:#c8e6c9
    style End fill:#ffcdd2
    style End2 fill:#c8e6c9
```

## 7. 完整對話示例時序圖

```mermaid
sequenceDiagram
    participant User as 用戶
    participant VC as VLLMClient
    participant VLLM as VLLM API
    participant MC as MCPClient
    participant MS as MCP Server

    User->>VC: "現在是幾點幾分？"

    VC->>VC: 添加到 conversation history

    rect rgb(230, 240, 255)
        Note over VC,VLLM: 第一輪：請求工具調用
        VC->>VLLM: POST /v1/chat/completions<br/>{messages, tools}
        VLLM->>VLLM: 分析需要使用 get-date tool
        VLLM-->>VC: {tool_calls: [{name: "get-date", args: {...}}]}
        VC->>VC: 添加 assistant message 到 history
    end

    rect rgb(255, 250, 230)
        Note over VC,MS: 執行工具調用
        VC->>MC: callTool("get-date", {format: "locale"})
        MC->>MS: CallToolRequest (via stdio)
        MS->>MS: 執行 get-date 邏輯
        MS-->>MC: {content: [{text: "現在時間: ..."}]}
        MC-->>VC: "現在時間: ..."
        VC->>VC: 添加 tool result 到 history
    end

    rect rgb(230, 255, 230)
        Note over VC,VLLM: 第二輪：生成最終回答
        VC->>VLLM: POST /v1/chat/completions<br/>{messages (含 tool result)}
        VLLM->>VLLM: 基於工具結果生成回答
        VLLM-->>VC: {content: "現在是下午2點30分"}
        VC->>VC: 添加 assistant message 到 history
    end

    VC-->>User: "現在是下午2點30分"

    Note over User,MS: 對話完成
```

## 8. 斷線和清理流程

```mermaid
flowchart TD
    Start([程序結束或<br/>調用 disconnect]) --> CallDisconnect[VLLMClient.disconnect]

    CallDisconnect --> MCPDisconnect[MCPClient.disconnect]

    MCPDisconnect --> ClientClose[client.close]

    ClientClose --> TransportClose[transport 關閉]

    TransportClose --> ProcessKill[終止 MCP Server<br/>子進程]

    ProcessKill --> Log[記錄斷線日誌]

    Log --> End([清理完成])

    style Start fill:#e1f5ff
    style ProcessKill fill:#ffcdd2
    style End fill:#c8e6c9
```

## 流程圖說明

### 1. 系統架構圖
展示了整個系統的組件和它們之間的通訊方式。

### 2. VLLM Client 初始化流程
說明了 VLLMClient 如何創建、連接 MCP Server、獲取工具列表並進行格式轉換。

### 3. 對話和工具調用主流程
核心的 agentic loop 流程，展示了如何處理用戶消息、調用 VLLM、處理工具調用、以及迭代直到獲得最終答案。

### 4. 工具調用處理流程
詳細展示了當模型請求工具調用時，如何與 MCP Server 交互並獲取結果。

### 5. MCP Client 工具調用詳細流程
展示了 MCPClient.callTool 方法的內部流程。

### 6. 文本工具調用解析流程
說明了當模型不支持原生 tool calls 時，如何從文本中解析 `<tool_call>` 標籤。

### 7. 完整對話示例時序圖
展示了一個完整的用戶查詢從開始到結束的所有步驟和組件交互。

### 8. 斷線和清理流程
說明了如何正確關閉連接和清理資源。

## 關鍵技術點

- **Stdio Transport**: MCP Client 和 Server 之間使用 stdin/stdout 進行 JSON-RPC 通訊
- **Agentic Loop**: 最多 5 次迭代，支持多輪工具調用
- **雙模式工具調用**: 支持原生 tool_calls 和文本解析兩種方式
- **異步初始化**: 使用靜態 async factory 方法處理異步設置
- **對話歷史管理**: 完整保存 system、user、assistant、tool 消息
- **錯誤處理**: 各個層級都有完善的錯誤處理機制
