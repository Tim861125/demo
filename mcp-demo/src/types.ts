// MCP Tool 相關類型
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

// OpenAI Function Calling 相關類型
export interface OpenAIFunction {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<string, any>;
      required?: string[];
    };
  };
}

// 訊息類型
export interface Message {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

// Tool Call 類型
export interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

// Tool Result 類型
export interface ToolResult {
  role: "tool";
  tool_call_id: string;
  content: string;
}

// vLLM API 請求類型
export interface ChatCompletionRequest {
  model: string;
  messages: Message[];
  tools?: OpenAIFunction[];
  tool_choice?: "auto" | "required" | { type: "function"; function: { name: string } };
  temperature?: number;
  max_tokens?: number;
}

// vLLM API 響應類型
export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: Message;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// vLLM Client 配置類型
export interface VLLMClientConfig {
  baseURL: string;
  model: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

// 工具執行參數類型
export interface GetDateArgs {
  format?: "iso" | "locale" | "date-only" | "time-only" | "timestamp";
  timezone?: string;
}
