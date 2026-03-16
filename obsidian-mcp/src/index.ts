import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { glob } from "glob";
import fs from "fs-extra";
import path from "path";

// 1. 環境變數檢查
const VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH;
if (!VAULT_PATH) {
  console.error("錯誤: 未設定 OBSIDIAN_VAULT_PATH 環境變數。");
  process.exit(1);
}

// 2. 初始化伺服器
const server = new McpServer({
  name: "obsidian-mcp-server",
  version: "1.0.0",
});

/**
 * 輔助函式：確保路徑在 Vault 內
 */
function resolveSafePath(relativePath: string): string {
  const absolutePath = path.resolve(VAULT_PATH!, relativePath);
  if (!absolutePath.startsWith(path.resolve(VAULT_PATH!))) {
    throw new Error("存取路徑超出 Vault 範圍。");
  }
  return absolutePath;
}

// 3. 工具註冊

// 工具 1: search_notes
server.tool(
  "search_notes",
  "在 Obsidian Vault 中搜尋筆記內容或檔名",
  {
    query: z.string().describe("搜尋關鍵字"),
  },
  async ({ query }) => {
    const files = await glob("**/*.md", { cwd: VAULT_PATH, absolute: true });
    const results = [];

    for (const file of files) {
      const content = await fs.readFile(file, "utf-8");
      const fileName = path.basename(file);
      
      if (fileName.toLowerCase().includes(query.toLowerCase()) || content.toLowerCase().includes(query.toLowerCase())) {
        const relativePath = path.relative(VAULT_PATH!, file);
        // 取得預覽內容 (前 200 字)
        const preview = content.length > 200 ? content.slice(0, 200) + "..." : content;
        results.push({ path: relativePath, preview });
      }
    }

    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
    };
  }
);

// 工具 2: read_note
server.tool(
  "read_note",
  "讀取指定筆記的完整 Markdown 內容",
  {
    path: z.string().describe("筆記相對於 Vault 的路徑 (例如: Folder/Note.md)"),
  },
  async ({ path: relativePath }) => {
    try {
      const fullPath = resolveSafePath(relativePath);
      if (!(await fs.pathExists(fullPath))) {
        return {
          content: [{ type: "text", text: `錯誤: 找不到檔案 ${relativePath}` }],
          isError: true,
        };
      }
      const content = await fs.readFile(fullPath, "utf-8");
      return {
        content: [{ type: "text", text: content }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `錯誤: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// 工具 3: list_recent_notes
server.tool(
  "list_recent_notes",
  "列出最近修改的筆記",
  {
    count: z.number().optional().default(10).describe("要列出的數量"),
  },
  async ({ count }) => {
    const files = await glob("**/*.md", { cwd: VAULT_PATH, absolute: true });
    
    const statsPromises = files.map(async (file) => ({
      file,
      stat: await fs.stat(file),
    }));
    
    const fileStats = await Promise.all(statsPromises);
    
    const recentFiles = fileStats
      .sort((a, b) => b.stat.mtime.getTime() - a.stat.mtime.getTime())
      .slice(0, count)
      .map(f => ({
        path: path.relative(VAULT_PATH!, f.file),
        modified: f.stat.mtime.toISOString()
      }));

    return {
      content: [{ type: "text", text: JSON.stringify(recentFiles, null, 2) }],
    };
  }
);

// 4. 啟動伺服器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Obsidian MCP Server 啟動中 (stdio)...");
}

main().catch((error) => {
  console.error("伺服器執行發生錯誤:", error);
  process.exit(1);
});
