#!/usr/bin/env bun

import type {
  VLLMClientConfig,
  Message,
  OpenAIFunction,
  ChatCompletionRequest,
  ChatCompletionResponse,
  ToolCall,
  MCPTool,
  ToolResult,
} from "./types.js";
import { MCPClient } from "./mcp-client.js";
import { readFile } from "fs/promises";
/**
 * 將 MCP 工具定義轉換為 OpenAI Function Calling 格式
 */
function convertMCPToolToOpenAI(mcpTool: MCPTool): OpenAIFunction {
  return {
    type: "function",
    function: {
      name: mcpTool.name,
      description: mcpTool.description,
      parameters: {
        type: mcpTool.inputSchema.type,
        properties: mcpTool.inputSchema.properties,
        required: mcpTool.inputSchema.required || [],
      },
    },
  };
}

/**
 * VLLM 客戶端，用於與 MCP 伺服器交互以執行工具調用
 */
export class VLLMClient {
  private baseURL: string;
  private model: string;
  private systemPrompt: string;
  private temperature: number;
  private maxTokens: number;
  private tools: OpenAIFunction[];
  private conversationHistory: Message[] = [];
  private mcpClient: MCPClient;

  // 私有構造函數，由異步工廠方法調用
  private constructor(config: VLLMClientConfig, mcpClient: MCPClient, tools: OpenAIFunction[]) {
    this.baseURL = config.baseURL;
    this.model = config.model;
    this.systemPrompt =
      config.systemPrompt ||
      "You are a helpful assistant that can use tools to answer questions.";
    this.temperature = config.temperature ?? 0.7;
    this.maxTokens = config.maxTokens ?? 1000;
    this.mcpClient = mcpClient;
    this.tools = tools;

    // 使用系統提示初始化對話歷史
    this.conversationHistory.push({
      role: "system",
      content: this.systemPrompt,
    });
  }

  /**
   * 異步創建並初始化 VLLMClient
   * 連接到 MCP 伺服器以獲取可用工具
   */
  static async create(config: VLLMClientConfig): Promise<VLLMClient> {
    const mcpClient = await MCPClient.create("bun", ["run", "src/index.ts"]);
    console.log("[VLLM Client] Fetching tools from MCP server...");
    const mcpTools = await mcpClient.listTools();
    const openAITools = mcpTools.map(convertMCPToolToOpenAI);
    console.log(`[VLLM Client] Loaded ${openAITools.length} tools.`);
    return new VLLMClient(config, mcpClient, openAITools);
  }

  /**
   * 斷開底層的 MCP 客戶端連接
   */
  disconnect() {
    this.mcpClient.disconnect();
  }

  private async sendRequest(
    messages: Message[],
    includeTools: boolean = true
  ): Promise<ChatCompletionResponse> {
    const url = `${this.baseURL}/v1/chat/completions`;
    const requestBody: ChatCompletionRequest = {
      model: this.model,
      messages: messages,
      tools: includeTools ? this.tools : undefined,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
    };
    console.log(`[VLLM Client] request: ${JSON.stringify(requestBody, null, 2)}`);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status} error: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to connect to vLLM server:", error);
      throw error;
    }
  }

  private parseTextToolCall(content: string): ToolCall | null {
    const toolCallMatch = content.match(/<tool_call>\s*\n?({[\s\S]*?})\s*\n?<\/tool_call>/);
    if (!toolCallMatch) return null;

    try {
      const parsed = JSON.parse(toolCallMatch[1]);
      return {
        id: `call_${Date.now()}`,
        type: "function",
        function: {
          name: parsed.name,
          arguments: JSON.stringify(parsed.arguments || {}),
        },
      };
    } catch (error) {
      console.error("Failed to parse text tool call:", error);
      return null;
    }
  }

  /**
   * 處理工具調用，將其委派給 MCP 伺服器
   */
  private async handleToolCalls(
    assistantMessage: Message
  ): Promise<Message[]> {
    if (!assistantMessage.tool_calls?.length) {
      return [];
    }

    console.log(
      `\n[VLLM Client] Model requested ${assistantMessage.tool_calls.length} tool call(s).`
    );

    const toolResults: ToolResult[] = await Promise.all(
      assistantMessage.tool_calls.map(async (toolCall) => {
        const args = JSON.parse(toolCall.function.arguments);
        console.log(`[VLLM Client] Calling MCP tool: ${toolCall.function.name}(${toolCall.function.arguments})`);

        try {
          // 將工具調用委派給 MCP 客戶端
          const result = await this.mcpClient.callTool(toolCall.function.name, args);
          console.log(`[VLLM Client] MCP tool result: ${result.text}`);

          return {
            role: "tool",
            tool_call_id: toolCall.id,
            content: result.text || "Tool executed successfully.",
          };
        } catch (error) {
           console.error(`[VLLM Client] Error calling MCP tool '${toolCall.function.name}':`, error);
           return {
             role: "tool",
             tool_call_id: toolCall.id,
             content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
           };
        }
      })
    );

    return toolResults;
  }

  async chat(userMessage: string): Promise<string> {
    this.conversationHistory.push({ role: "user", content: userMessage });
    console.log(`\n[VLLM Client] Sending request to vLLM...`);

    let maxIterations = 5;
    while (maxIterations-- > 0) {
      const hasToolResult = this.conversationHistory.some(msg => msg.role === "tool");
      const response = await this.sendRequest(this.conversationHistory, !hasToolResult);

      console.log(`[VLLM Client] Received response from vLLM: ${JSON.stringify(response, null, 2)}`);

      if (!response.choices?.length) throw new Error("No response from vLLM");

      const assistantMessage = response.choices[0].message;

      if (assistantMessage.content && !assistantMessage.tool_calls?.length) {
        const parsedToolCall = this.parseTextToolCall(assistantMessage.content);

        if (parsedToolCall) {
          console.log(`\n[VLLM Client] Detected and parsed text-based tool call.`);
          assistantMessage.tool_calls = [parsedToolCall];
          assistantMessage.content = null;
        }
      }

      this.conversationHistory.push({
        role: assistantMessage.role,
        content: assistantMessage.content,
        tool_calls: assistantMessage.tool_calls,
      });

      if (assistantMessage.tool_calls?.length) {
        const toolResults = await this.handleToolCalls(assistantMessage);
        console.log(`[VLLM Client] Tool results: ${JSON.stringify(toolResults, null, 2)}`);
        this.conversationHistory.push(...toolResults);
        console.log(`[VLLM Client] Returning results to model...`);
        continue;
      }

      if (assistantMessage.content) {
        console.log(`[VLLM Client] Final model response: ${assistantMessage.content}\n`);
        return assistantMessage.content;
      } else {
        throw new Error("Assistant message has no content and no tool calls.");
      }
    }

    throw new Error("Max iterations reached in conversation loop.");
  }

  resetConversation(): void {
    this.conversationHistory = [{ role: "system", content: this.systemPrompt }];
  }

  getConversationHistory(): Message[] {
    return [...this.conversationHistory];
  }
}

/**
 * 主 CLI 執行區塊
 */
async function main() {
  console.log("=== vLLM Function Calling Client (MCP-Connected) ===\n");
  let client: VLLMClient | undefined;

  try {
    // 創建客戶端，同時啟動 MCP 伺服器進程
    client = await VLLMClient.create({
      baseURL: "http://192.168.50.91:8000",
      model: "cpatonn/Qwen3-30B-A3B-Instruct-2507-AWQ-4bit",
      systemPrompt: "You are a helpful assistant. If a tool is relevant, you MUST call it using <tool_call> XML format and do not answer directly.",
    });
    const prompt = await readFile("prompt.txt", "utf8");

    const testQueries = ["SQL"];

    for (const query of testQueries) {
      const fullPrompt = prompt + "\n" + query;
      console.log(`\n${"=".repeat(60)}\nUser: ${query}\n${"=".repeat(60)}`);
      const response = await client.chat(fullPrompt);
      console.log(`\nAssistant: ${response}`);
      client.resetConversation(); // 為下一個查詢重置對話
    }
  } catch (error) {
    console.error("\nFatal error in main execution:", error);
    process.exit(1);
  } finally {
    // 確保 MCP 伺服器子進程被終止
    if (client) {
      client.disconnect();
    }
  }

  console.log("\n=== Test complete ===");
}

// 如果腳本直接執行則運行 main 函數
if (import.meta.url.startsWith('file://') && process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}

