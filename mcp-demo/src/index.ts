#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "mcp-date-demo",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 定义工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get-weather",
        description: "Get the current weather information",
        inputSchema: {
          type: "object",
          properties: {
            format: {
              type: "string",
              description: "Date format: 'iso' (default), 'locale', 'date-only', 'time-only', or 'timestamp'",
              enum: ["iso", "locale", "date-only", "time-only", "timestamp"],
            },
            timezone: {
              type: "string",
              description: "Optional timezone (e.g., 'Asia/Taipei', 'America/New_York')",
            },
          },
          required: [],
        },
      },
      {
        name: "get-patents-count",
        description: "Get the total number of patents that match a specific keyword or query. Use this tool when you want to find how many patents exist for a given topic or term.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Keyword or query string must follow Lucene syntax for patent searching (e.g., TAC:('electric vehicle') AND IPC:(B60L* B60K006* B60W010* H02J007* H02M* B60R016* B60R011*)). This field is required.",
            },
          },
          required: ["query"], // query 是必填
        },
      }
    ],
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get-date") {
    const { format = "iso", timezone } = request.params.arguments as {
      format?: string;
      timezone?: string
    };

    // 获取当前日期
    const now = new Date();
    let result: string;

    // 根据格式返回不同的日期字符串
    switch (format) {
      case "iso":
        result = now.toISOString();
        break;
      case "locale":
        result = timezone
          ? now.toLocaleString("en-US", { timeZone: timezone })
          : now.toLocaleString();
        break;
      case "date-only":
        result = timezone
          ? now.toLocaleDateString("en-US", { timeZone: timezone })
          : now.toLocaleDateString();
        break;
      case "time-only":
        result = timezone
          ? now.toLocaleTimeString("en-US", { timeZone: timezone })
          : now.toLocaleTimeString();
        break;
      case "timestamp":
        result = now.getTime().toString();
        break;
      default:
        result = now.toISOString();
    }

    return {
      content: [
        {
          type: "text",
          text: timezone
            ? `Current date/time (${timezone}): ${result}`
            : `Current date/time: ${result}`,
        },
      ],
    };
  }
  else if (request.params.name === "get-patents-count") {

    return {
      content: [
        {
          type: "text",
          text: `Total patents count is 12345678.`,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Date Demo server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
