#!/usr/bin/env node

import type {
  VLLMClientConfig,
  Message,
  OpenAIFunction,
  ChatCompletionRequest,
  ChatCompletionResponse,
  ToolCall,
} from "./types.js";
import { convertAllTools } from "./tool-converter.js";
import { executeTools } from "./tool-executor.js";

/**
 * vLLM 客戶端類別
 */
export class VLLMClient {
  private baseURL: string;
  private model: string;
  private systemPrompt: string;
  private temperature: number;
  private maxTokens: number;
  private tools: OpenAIFunction[];
  private conversationHistory: Message[] = [];

  constructor(config: VLLMClientConfig) {
    this.baseURL = config.baseURL;
    this.model = config.model;
    this.systemPrompt =
      config.systemPrompt ||
      "你是一個有用的助手，可以使用工具來回答問題。";
    this.temperature = config.temperature ?? 0.7;
    this.maxTokens = config.maxTokens ?? 1000;
    this.tools = convertAllTools();

    // 初始化對話歷史，加入系統提示
    this.conversationHistory.push({
      role: "system",
      content: this.systemPrompt,
    });
  }

  /**
   * 發送請求到 vLLM API
   */
  private async sendRequest(
    messages: Message[]
  ): Promise<ChatCompletionResponse> {
    const url = `${this.baseURL}/v1/chat/completions`;

    const requestBody: ChatCompletionRequest = {
      model: this.model,
      messages: messages,
      tools: this.tools,
      // tool_choice: "auto", // 註解掉，因為 vLLM 需要 --enable-auto-tool-choice 參數
      temperature: this.temperature,
      max_tokens: this.maxTokens,
    };

    // Debug: 輸出請求體
    console.log("[Debug] Request body:", JSON.stringify(requestBody, null, 2));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP ${response.status} error:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to connect to vLLM server:", error);
      throw error;
    }
  }

  /**
   * 解析文本格式的 tool call（用於不支援標準格式的 vLLM）
   * 格式: <tool_call>\n{"name": "xxx", "arguments": {...}}\n</tool_call>
   */
  private parseTextToolCall(content: string): ToolCall | null {
    const toolCallMatch = content.match(/<tool_call>\s*\n?({[\s\S]*?})\s*\n?<\/tool_call>/);
    if (!toolCallMatch) {
      return null;
    }

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
   * 處理工具調用
   */
  private async handleToolCalls(
    assistantMessage: Message
  ): Promise<Message[]> {
    if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
      return [];
    }

    console.log(
      `\n[Client] 模型返回 ${assistantMessage.tool_calls.length} 個 tool_call`
    );

    // 執行所有工具調用
    const toolResults = await executeTools(assistantMessage.tool_calls);

    // 輸出執行資訊
    for (let i = 0; i < assistantMessage.tool_calls.length; i++) {
      const toolCall = assistantMessage.tool_calls[i];
      const result = toolResults[i];
      console.log(
        `[Client] 執行工具: ${toolCall.function.name}(${toolCall.function.arguments})`
      );
      console.log(`[Client] 工具結果: ${result.content}`);
    }

    return toolResults;
  }

  /**
   * 單次對話
   */
  async chat(userMessage: string): Promise<string> {
    // 添加用戶訊息到歷史
    const userMsg: Message = {
      role: "user",
      content: userMessage,
    };
    this.conversationHistory.push(userMsg);

    console.log(`\n[Client] 發送請求到 vLLM...`);

    // 對話循環 - 處理可能的多輪工具調用
    let maxIterations = 5; // 防止無限循環
    let iteration = 0;

    while (iteration < maxIterations) {
      iteration++;

      // 發送請求
      const response = await this.sendRequest(this.conversationHistory);

      if (!response.choices || response.choices.length === 0) {
        throw new Error("No response from vLLM");
      }

      const assistantMessage = response.choices[0].message;

      // 嘗試從文本內容中解析 tool call（用於不支援標準格式的 vLLM）
      if (assistantMessage.content && !assistantMessage.tool_calls?.length) {
        const parsedToolCall = this.parseTextToolCall(assistantMessage.content);
        if (parsedToolCall) {
          console.log(`\n[Client] 偵測到文本格式的 tool_call，已解析`);
          assistantMessage.tool_calls = [parsedToolCall];
          // 清空 content，因為它已經被解析為 tool_call
          assistantMessage.content = null;
        }
      }

      // 清理 assistant message，只保留必要欄位（避免 vLLM 無法處理額外欄位）
      const cleanedMessage: Message = {
        role: assistantMessage.role,
        content: assistantMessage.content,
        tool_calls: assistantMessage.tool_calls,
      };

      // 將助手訊息加入歷史
      this.conversationHistory.push(cleanedMessage);

      // 檢查是否有工具調用
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        // 執行工具調用
        const toolResults = await this.handleToolCalls(assistantMessage);

        // 將工具結果加入歷史
        this.conversationHistory.push(...toolResults);

        console.log(`[Client] 將結果返回給模型...\n`);

        // 繼續循環，讓模型基於工具結果生成最終回答
        continue;
      }

      // 沒有工具調用，返回最終回答
      if (assistantMessage.content) {
        console.log(`[Client] 模型最終回答: ${assistantMessage.content}\n`);
        return assistantMessage.content;
      } else {
        throw new Error("Assistant message has no content");
      }
    }

    throw new Error("Max iterations reached in conversation loop");
  }

  /**
   * 重置對話歷史
   */
  resetConversation(): void {
    this.conversationHistory = [
      {
        role: "system",
        content: this.systemPrompt,
      },
    ];
  }

  /**
   * 取得對話歷史
   */
  getConversationHistory(): Message[] {
    return [...this.conversationHistory];
  }
}

/**
 * 主程式 - CLI 介面
 */
async function main() {
  console.log("=== vLLM Function Calling Client ===\n");

  // 創建客戶端
  const client = new VLLMClient({
    baseURL: "http://192.168.1.63:30327",
    model: "cpatonn/Qwen3-30B-A3B-Instruct-2507-AWQ-4bit",
    systemPrompt: "你是一個有用的助手，可以使用工具來回答問題。當用戶詢問時間、日期相關問題時，你必須使用 get-date 工具來獲取準確的資訊。",
  });

  // 測試查詢
  const testQueries = [
    "現在是幾年幾月幾號？",
    "紐約現在幾點？",
    "用 ISO 格式顯示台北現在的時間",
  ];

  for (const query of testQueries) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`User: ${query}`);
    console.log("=".repeat(60));

    try {
      const response = await client.chat(query);
      console.log(`\nAssistant: ${response}`);
    } catch (error) {
      console.error(
        `\nError: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    // 每次查詢後稍微等待
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n=== 測試完成 ===");
}

// 如果直接執行此檔案，則運行主程式
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
