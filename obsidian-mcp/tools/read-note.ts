import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObsidianService } from "../services/obsidian-service";
import { log } from "../utils/logger";

export function registerReadNoteTool(server: McpServer) {
	server.registerTool(
		"read_note",
		{
			title: "讀取 Obsidian 筆記",
			description: "讀取指定筆記的完整 Markdown 內容",
			inputSchema: {
				path: z.string().describe("筆記相對於 Vault 的路徑 (例如: Folder/Note.md)"),
			},
		},
		async ({ path }) => {
			log("INFO", "Tool: read_note", { path });
			try {
				const content = await getObsidianService().readNote(path);
				return { content: [{ type: "text", text: content }] };
			} catch (error) {
				return {
					content: [{ type: "text", text: `錯誤: ${error instanceof Error ? error.message : String(error)}` }],
					isError: true,
				};
			}
		},
	);
}
