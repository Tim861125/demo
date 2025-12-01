# SSE Demo 專案規格文件

## 專案概述

這是一個 MVC 架構的示範專案，用於展示如何呼叫 PatentPilot Service 的 `ask-question` API 並處理 Server-Sent Events (SSE) 串流回應。

## 技術需求

### 必要技術
- **後端框架**: ASP.NET Core MVC (建議 .NET 6+ 或 .NET 8)
- **前端技術**: JavaScript (Vanilla JS 或簡單的 jQuery)
- **HTTP Client**: HttpClient (後端) / EventSource API (前端)

### 可選技術
- Bootstrap 5 (用於簡單的 UI 樣式)
- SignalR (若需要後端轉發 SSE 到前端)

## API 規格

### 目標 API Endpoint
```
POST http://[patentpilot-service-url]/api/auth/ask-question
```

### 認證方式
- **類型**: JWT Bearer Token
- **演算法**: RS256 (使用公鑰/私鑰對)
- **Header**: `Authorization: Bearer {token}`

### JWT Payload 必要欄位

```json
{
  "model": "gpt-4o-mini",
  "promptKey": "WebpatDescriptionSummary",
  "product": "WebPat",
  "userName": "demo_user",
  "stream": true,
  "userId": "user-123",
  "crmId": "crm-456",
  "applicationName": "SSE-Demo",
  "fromCache": true,
  "language": "zh-hant",
  "exp": 1735689600
}
```

**欄位說明**:
- `model` (必填): AI 模型名稱，可選值參考下方「支援的 AI 模型」
- `promptKey` (選填): Prompt 模板鍵值，若不使用模板可省略
- `product` (必填): 產品名稱
- `userName` (必填): 使用者名稱
- `stream` (選填): 是否使用串流模式，預設 `true`
- `userId` (選填): 使用者 ID
- `crmId` (必填): CRM ID，用於點數驗證
- `applicationName` (必填): 應用程式名稱，用於點數驗證
- `fromCache` (選填): 是否優先使用快取，預設 `true`
- `language` (選填): 回應語言，預設 `zh-hant`，可選 `en`, `zh-hant`, `zh-cn`
- `exp` (必填): JWT 過期時間 (Unix timestamp)

### Request Body 格式

```json
{
  "parameters": {
    "content": "你好，請介紹一下台灣的專利制度"
  },
  "chatId": "optional-chat-id-for-history"
}
```

**欄位說明**:
- `parameters.content` (必填): 使用者的問題文字
- `chatId` (選填): 聊天 ID，用於維持對話歷史。若不提供會自動生成新的 UUIDv7

### Response 格式

#### Stream 模式 (stream: true)

**Headers**:
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
x-from-cache: yes (如果是從快取返回)
```

**SSE Data 格式**:
```
data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4o-mini","choices":[{"index":0,"delta":{"content":"你"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4o-mini","choices":[{"index":0,"delta":{"content":"好"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4o-mini","choices":[{"index":0,"delta":{"content":"！"},"finish_reason":null}]}

data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4o-mini","choices":[{"index":0,"delta":{},"finish_reason":"stop"}],"usage":{"prompt_tokens":20,"completion_tokens":50,"total_tokens":70}}

data: [DONE]
```

**SSE 資料解析規則**:
1. 每一行以 `data: ` 開頭
2. 每個 chunk 是一個 JSON 物件
3. `choices[0].delta.content` 包含本次的文字片段
4. `finish_reason: "stop"` 表示回應結束
5. 最後一個 chunk 包含 `usage` 資訊 (token 統計)
6. 結束時會收到 `data: [DONE]`

#### Non-Stream 模式 (stream: false)

```json
{
  "success": true,
  "result": {
    "id": "chatcmpl-xxx",
    "object": "chat.completion",
    "created": 1234567890,
    "model": "gpt-4o-mini",
    "choices": [
      {
        "index": 0,
        "message": {
          "role": "assistant",
          "content": "你好！台灣的專利制度..."
        },
        "finish_reason": "stop"
      }
    ],
    "usage": {
      "prompt_tokens": 20,
      "completion_tokens": 150,
      "total_tokens": 170
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

**常見錯誤狀態碼**:
- `400`: Request body 驗證失敗或 Prompt 不存在
- `401`: JWT token 無效或過期
- `403`: 點數不足 (Insufficient points)
- `500`: 內部伺服器錯誤

## 支援的 AI 模型

### OpenAI Models
- `gpt-4o`
- `gpt-4o-mini`
- `gpt-4.1-mini`

### Google Gemini Models
- `gemini-2.5-pro-preview-05-06`
- `gemini-2.5-flash`

### xAI Grok Models
- `grok-2-latest`
- `grok-2-1212`
- `grok-3-beta`

### Local Ollama Models
- `deepseek-r1:32b`, `deepseek-r1:70b`
- `qwq:32b`
- `gemma3:27b`
- `mistral-small-3.1-24b-instruct-2503`
- `gemma-3-27b-it`
- `qwen3-30b-a3b-mlx`, `qwen3-30b-a3b`

## 專案功能需求

### 1. 首頁 (Index Page)

#### UI 元件
- 標題: "SSE Demo - PatentPilot AI 對話"
- 模型選擇下拉選單 (Model Selector)
- 語言選擇: zh-hant / en / zh-cn
- 問題輸入區 (Textarea)
- 送出按鈕 (Submit Button)
- 回應顯示區 (Response Display Area)
- 清除對話按鈕 (Clear Chat Button)

#### 功能
1. **送出問題**:
   - 點擊送出按鈕後，呼叫後端 API
   - 顯示 Loading 狀態
   - 禁用送出按鈕直到回應完成

2. **即時顯示回應**:
   - 使用 EventSource API 接收 SSE
   - 逐字顯示 AI 回應 (打字機效果)
   - 顯示「正在思考...」載入動畫

3. **錯誤處理**:
   - 顯示錯誤訊息 (紅色提示)
   - JWT 過期時提示重新整理頁面

4. **對話歷史**:
   - 維持 chatId，支援多輪對話
   - 顯示歷史訊息 (使用者 vs AI)

### 2. 後端 Controller

#### JWT Token 生成
```csharp
// JwtController.cs
public class JwtController : Controller
{
    [HttpPost]
    public IActionResult GenerateToken([FromBody] TokenRequest request)
    {
        // 使用 RS256 演算法生成 JWT
        // 讀取私鑰檔案
        // 設定 Payload
        // 返回 token
    }
}
```

#### API 呼叫 Proxy
```csharp
// AskQuestionController.cs
public class AskQuestionController : Controller
{
    [HttpPost]
    public async Task StreamResponse([FromBody] AskQuestionRequest request)
    {
        // 1. 生成或取得 JWT token
        // 2. 呼叫 PatentPilot Service API
        // 3. 直接轉發 SSE stream 到前端
        // 4. 或使用 SignalR 推送資料
    }
}
```

### 3. 前端 JavaScript

#### EventSource 處理
```javascript
const eventSource = new EventSource('/api/stream-ask-question');

eventSource.onmessage = (event) => {
  if (event.data === '[DONE]') {
    eventSource.close();
    return;
  }

  const chunk = JSON.parse(event.data);
  const content = chunk.choices[0]?.delta?.content || '';

  // 將 content 附加到顯示區
  appendToResponseArea(content);
};

eventSource.onerror = (error) => {
  console.error('SSE Error:', error);
  eventSource.close();
  showErrorMessage('連線錯誤，請重試');
};
```

## 實作步驟建議

### Phase 1: 基礎架構
1. 建立 ASP.NET Core MVC 專案
2. 安裝必要 NuGet 套件:
   - `System.IdentityModel.Tokens.Jwt`
   - `Microsoft.AspNetCore.Authentication.JwtBearer`
3. 設定專案結構 (Controllers, Models, Views)

### Phase 2: JWT 實作
1. 生成 RS256 金鑰對 (public-key.pem, private-key.pem)
2. 實作 JWT Token 生成功能
3. 測試 Token 是否符合規格

### Phase 3: API 整合
1. 實作後端 HttpClient 呼叫 PatentPilot API
2. 處理 SSE Stream 轉發
3. 實作錯誤處理機制

### Phase 4: 前端開發
1. 建立 UI 介面
2. 實作 EventSource 接收 SSE
3. 實作即時顯示邏輯
4. 加入對話歷史功能

### Phase 5: 測試與優化
1. 測試各種 AI 模型
2. 測試錯誤情境 (token 過期、點數不足等)
3. 優化 UI/UX
4. 加入 Loading 動畫與狀態提示

## 測試資料範例

### 簡單問答測試
```json
{
  "parameters": {
    "content": "請用繁體中文介紹台灣的專利申請流程"
  }
}
```

### 多輪對話測試
第一輪:
```json
{
  "parameters": {
    "content": "什麼是發明專利？"
  },
  "chatId": null
}
```

第二輪 (使用返回的 chatId):
```json
{
  "parameters": {
    "content": "它跟新型專利有什麼不同？"
  },
  "chatId": "01963a1c-7f8e-7890-b123-456789abcdef"
}
```

### 使用 Prompt 模板測試 (進階)
```json
{
  "parameters": {
    "content": "專利摘要內容",
    "language": "en"
  }
}
```
(此時 JWT payload 中的 `promptKey` 會決定使用哪個模板)

## 環境設定

### appsettings.json
```json
{
  "PatentPilotService": {
    "BaseUrl": "http://localhost:3000",
    "PrivateKeyPath": "keys/private-key.pem",
    "PublicKeyPath": "keys/public-key.pem"
  },
  "JwtSettings": {
    "Issuer": "SSE-Demo",
    "Audience": "PatentPilot-Service",
    "ExpirationMinutes": 60
  }
}
```

## 安全性考量

1. **JWT 金鑰管理**:
   - 私鑰不可外洩
   - 建議使用環境變數或 Azure Key Vault 儲存
   - 定期輪換金鑰

2. **點數驗證**:
   - 確保 `crmId` 和 `applicationName` 正確
   - 處理點數不足的錯誤情況

3. **Input 驗證**:
   - 限制問題文字長度 (建議 30,000 字以內)
   - 防止 XSS 攻擊 (前端顯示時進行 HTML encode)

4. **Rate Limiting**:
   - 建議加入 API 呼叫頻率限制
   - 防止濫用

## 延伸功能建議

1. **對話管理**:
   - 儲存對話歷史到資料庫
   - 提供對話列表與檢索功能

2. **效能監控**:
   - 記錄 Token 使用量
   - 追蹤回應時間與成本

3. **UI 增強**:
   - Markdown 渲染 (AI 回應支援格式化)
   - 代碼高亮顯示
   - 複製回應功能

4. **多模型比較**:
   - 同時呼叫多個模型
   - 並排顯示回應結果

## 參考資源

- [Hono.js 官方文件](https://hono.dev/)
- [JWT RS256 規格](https://tools.ietf.org/html/rfc7519)
- [Server-Sent Events 規格](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [EventSource API MDN 文件](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
- [OpenAI API 文件](https://platform.openai.com/docs/api-reference/streaming)

## 附註

- 此規格基於 PatentPilot Service v1.0.26
- 預設使用 Bun runtime 和 Hono framework
- 資料庫使用 SQL Server + Prisma ORM
- 支援 Docker 部署

---

**文件版本**: 1.0
**最後更新**: 2025-12-01
**維護者**: PatentPilot Development Team
