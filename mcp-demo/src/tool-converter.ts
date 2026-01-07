import type { MCPTool, OpenAIFunction } from "./types.js";

/**
 * 將 MCP 工具定義轉換為 OpenAI function calling 格式
 */
export function convertMCPToolToOpenAI(mcpTool: MCPTool): OpenAIFunction {
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
 * 取得所有可用的 MCP 工具定義
 */
export function getMCPTools(): MCPTool[] {
  return [
    {
      name: "get-date",
      description: "Get the current date and time with optional formatting",
      inputSchema: {
        type: "object",
        properties: {
          format: {
            type: "string",
            description:
              "Date format: 'iso' (default), 'locale', 'date-only', 'time-only', or 'timestamp'",
            enum: ["iso", "locale", "date-only", "time-only", "timestamp"],
          },
          timezone: {
            type: "string",
            description:
              "Optional timezone (e.g., 'Asia/Taipei', 'America/New_York')",
          },
        },
        required: [],
      },
    },
  ];
}

/**
 * 將所有 MCP 工具轉換為 OpenAI functions
 */
export function convertAllTools(): OpenAIFunction[] {
  const mcpTools = getMCPTools();
  return mcpTools.map(convertMCPToolToOpenAI);
}
