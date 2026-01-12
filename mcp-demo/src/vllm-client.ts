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
import { readFile, writeFile, appendFile, mkdir } from "fs/promises";
import * as readline from "readline";
import { existsSync } from "fs";
import path from "path";

/**
 * Logger 類 - 管理日誌文件寫入
 */
class Logger {
  private logFilePath: string | null = null;
  private logBuffer: string[] = [];

  /**
   * 初始化新的日誌文件
   */
  async initLogFile(query: string): Promise<void> {
    // 創建 logs 目錄（如果不存在）
    const logsDir = path.join(process.cwd(), "logs");
    if (!existsSync(logsDir)) {
      await mkdir(logsDir, { recursive: true });
    }

    // 生成文件名：問題_時間戳.log
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const sanitizedQuery = query.substring(0, 30).replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_");
    const filename = `${sanitizedQuery}_${timestamp}.log`;
    this.logFilePath = path.join(logsDir, filename);

    // 初始化日誌文件
    this.logBuffer = [];
    await writeFile(this.logFilePath, `=== 專利查詢日誌 ===\n查詢時間: ${new Date().toLocaleString("zh-TW")}\n查詢關鍵字: ${query}\n\n${"=".repeat(80)}\n\n`);
    console.log(`[Logger] 日誌文件創建: ${this.logFilePath}`);
  }

  /**
   * 寫入日誌
   */
  async log(message: string): Promise<void> {
    if (!this.logFilePath) return;

    const timestamp = new Date().toLocaleTimeString("zh-TW");
    const logMessage = `[${timestamp}] ${message}\n`;

    // 同時輸出到控制台和文件
    console.log(message);
    await appendFile(this.logFilePath, logMessage);
  }

  /**
   * 寫入分隔線
   */
  async logSeparator(): Promise<void> {
    if (!this.logFilePath) return;
    await appendFile(this.logFilePath, `\n${"-".repeat(80)}\n\n`);
  }

  /**
   * 結束日誌記錄
   */
  async finalize(): Promise<void> {
    if (!this.logFilePath) return;
    await appendFile(this.logFilePath, `\n${"=".repeat(80)}\n查詢完成時間: ${new Date().toLocaleString("zh-TW")}\n`);
    console.log(`[Logger] 日誌已保存: ${this.logFilePath}\n`);
    this.logFilePath = null;
  }
}

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
  private logger: Logger = new Logger();

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

    // console.log(
    //   `\n[VLLM Client] Model requested ${assistantMessage.tool_calls.length} tool call(s).`
    // );

    await this.logger.log(`[VLLM Client] Model requested ${assistantMessage.tool_calls.length} tool call(s)`);

    const toolResults: ToolResult[] = await Promise.all(
      assistantMessage.tool_calls.map(async (toolCall) => {
        const args = JSON.parse(toolCall.function.arguments);
        await this.logger.log(`[VLLM Client] Calling MCP tool: ${toolCall.function.name}(${toolCall.function.arguments})`);

        try {
          // 將工具調用委派給 MCP 客戶端
          const result = await this.mcpClient.callTool(toolCall.function.name, args);
          await this.logger.log(`[VLLM Client] MCP tool result: ${result.text}`);

          return {
            role: "tool",
            content: result.text || "Tool executed successfully.",
          };
        } catch (error) {
           await this.logger.log(`[VLLM Client] Error calling MCP tool '${toolCall.function.name}': ${error}`);
           return {
             role: "tool",
             content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
           };
        }
      })
    );

    return toolResults;
  }

  async chat(userMessage: string, userQuery?: string): Promise<string> {
    const userQuestion = userQuery || "未知";

    // 初始化日誌文件
    await this.logger.initLogFile(userQuestion);
    await this.logger.log(`用戶輸入: ${userQuestion}`);
    await this.logger.logSeparator();

    try {
      this.conversationHistory.push({ role: "user", content: userMessage });
      await this.logger.log(`[VLLM Client] Sending request to vLLM...`);

      let maxIterations = 5;
      let isFirstIteration = true;
      const prompt2Template = await readFile("prompt2.txt", "utf8");

    while (maxIterations-- > 0) {
      // 如果不是第一次迭代，用 prompt2 取代原本的 userMessage
      let messagesToSend = [...this.conversationHistory];
      if (!isFirstIteration) {
        // 从 tool results 中提取专利数量和查询条件
        let patentCount = "未知";
        let originalQuery = "未知";
        for (let i = messagesToSend.length - 1; i >= 0; i--) {
          if (messagesToSend[i].role === "tool") {
            const content = messagesToSend[i].content;
            // 匹配格式: Total patents count: 40142 \n (Query: TAC:(LED))
            const match = content?.match(/Total patents count:\s*(\d+)\s*\n\s*\(Query:\s*(.+)\)/);
            if (match) {
              patentCount = match[1];
              originalQuery = match[2];
              break;
            }
          }
        }

        // 将 total 数量和原始查询插入到 prompt2 的最前面
        const prompt2Content = `[使用者提問]: ${userQuestion}\n[原始檢索條件句]: ${originalQuery}\n[檢索結果筆數]: ${patentCount}\n\n${prompt2Template}`;

        // 找到最后一个 user message，将其内容替换为 prompt2
        for (let i = messagesToSend.length - 1; i >= 0; i--) {
          if (messagesToSend[i].role === "user") {
            messagesToSend[i] = {
              ...messagesToSend[i],
              content: prompt2Content
            };
            await this.logger.log(`[VLLM Client] Replacing user message with prompt2 (patent count: ${patentCount})`);
            break;
          }
        }
      }

      const response = await this.sendRequest(messagesToSend, true);

      isFirstIteration = false;

      await this.logger.log(`[VLLM Client] maxIterations left: ${maxIterations}`);
      await this.logger.log(`[VLLM Client] Received response from vLLM`);
      await this.logger.logSeparator();

      if (!response.choices?.length) throw new Error("No response from vLLM");

      const assistantMessage = response.choices[0].message;

      if (assistantMessage.content && !assistantMessage.tool_calls?.length) {
        const parsedToolCall = this.parseTextToolCall(assistantMessage.content);

        if (parsedToolCall) {
          // console.log(`\n[VLLM Client] Detected and parsed text-based tool call.`);
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
        await this.logger.log(`[VLLM Client] Tool results received: ${toolResults.length} result(s)`);
        for (const result of toolResults) {
          await this.logger.log(`  - ${result.content}`);
        }
        this.conversationHistory.push(...toolResults);
        await this.logger.log(`[VLLM Client] Returning results to model...`);
        await this.logger.logSeparator();
        continue;
      }

      if (assistantMessage.content) {
        await this.logger.log(`[VLLM Client] Final model response: ${assistantMessage.content}`);
        await this.logger.logSeparator();
        await this.logger.finalize();
        return assistantMessage.content;
      } else {
        throw new Error("Assistant message has no content and no tool calls.");
      }
    }

      throw new Error("Max iterations reached in conversation loop.");
    } catch (error) {
      await this.logger.log(`[ERROR] ${error instanceof Error ? error.message : "Unknown error"}`);
      await this.logger.finalize();
      throw error;
    }
  }

  resetConversation(): void {
    this.conversationHistory = [{ role: "system", content: this.systemPrompt }];
  }

  getConversationHistory(): Message[] {
    return [...this.conversationHistory];
  }
}

/**
 * 主 CLI 執行區塊 - 互動模式
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
    const prompt = await readFile("prompt1.txt", "utf8");

    // 創建 readline 介面
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("輸入專利查詢關鍵字 (輸入 'exit' 或 'quit' 結束):\n");

    // 互動式循環
    const askQuestion = () => {
      rl.question("查詢> ", async (query) => {
        const trimmedQuery = query.trim();

        // 檢查退出指令
        if (trimmedQuery.toLowerCase() === "exit" || trimmedQuery.toLowerCase() === "quit") {
          console.log("\n再見！");
          rl.close();
          if (client) {
            client.disconnect();
          }
          process.exit(0);
        }

        // 檢查空輸入
        if (!trimmedQuery) {
          console.log("請輸入查詢關鍵字\n");
          askQuestion();
          return;
        }

        try {
          const fullPrompt = prompt + "\n" + trimmedQuery;
          console.log(`\n${"=".repeat(60)}\nUser: ${trimmedQuery}\n${"=".repeat(60)}`);
          const response = await client!.chat(fullPrompt, trimmedQuery);
          console.log(`\nAssistant: ${response}\n`);
          client!.resetConversation(); // 為下一個查詢重置對話
        } catch (error) {
          console.error("\n查詢錯誤:", error);
        }

        // 繼續下一輪提問
        askQuestion();
      });
    };

    // 開始互動
    askQuestion();

  } catch (error) {
    console.error("\nFatal error in main execution:", error);
    process.exit(1);
  }
}

// 如果腳本直接執行則運行 main 函數
if (import.meta.url.startsWith('file://') && process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}

