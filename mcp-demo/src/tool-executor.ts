import type { ToolCall, ToolResult, GetDateArgs } from "./types.js";

/**
 * 執行 get-date 工具
 */
function executeGetDate(args: GetDateArgs): string {
  const { format = "iso", timezone } = args;
  const now = new Date();

  try {
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
  } catch (error) {
    throw new Error(
      `Failed to format date: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * 執行工具調用並返回結果
 */
export async function executeTool(toolCall: ToolCall): Promise<ToolResult> {
  try {
    // 解析工具參數
    let args: any;
    try {
      args = JSON.parse(toolCall.function.arguments);
    } catch (error) {
      console.error(
        "Failed to parse tool arguments:",
        toolCall.function.arguments
      );
      return {
        role: "tool",
        tool_call_id: toolCall.id,
        content: "Error: Invalid arguments format",
      };
    }

    // 根據工具名稱執行對應的工具
    let result: string;
    switch (toolCall.function.name) {
      case "get-date":
        result = executeGetDate(args);
        break;
      default:
        throw new Error(`Unknown tool: ${toolCall.function.name}`);
    }

    return {
      role: "tool",
      tool_call_id: toolCall.id,
      content: args.timezone
        ? `Current date/time (${args.timezone}): ${result}`
        : `Current date/time: ${result}`,
    };
  } catch (error) {
    console.error("Error executing tool:", error);
    return {
      role: "tool",
      tool_call_id: toolCall.id,
      content: `Error executing tool: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// 修正變數引用錯誤
function formatResult(result: string, timezone?: string): string {
  return timezone
    ? `Current date/time (${timezone}): ${result}`
    : `Current date/time: ${result}`;
}

/**
 * 批次執行多個工具調用
 */
export async function executeTools(
  toolCalls: ToolCall[]
): Promise<ToolResult[]> {
  return Promise.all(toolCalls.map(executeTool));
}
