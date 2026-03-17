import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObsidianService } from "../services/obsidian-service";
import { log } from "../utils/logger";

export function registerSearchNotesTool(server: McpServer) {
	server.registerTool(
		"search_notes",
		{
			title: "搜尋 Obsidian 筆記",
			description: "在 Obsidian Vault 中搜尋筆記內容或檔名",
			inputSchema: {
				query: z.string().describe("搜尋關鍵字"),
			},
		},
		async ({ query }) => {
			log("INFO", "Tool: search_notes", { query });
			try {
				const results = await getObsidianService().searchNotes(query);
				return {
					content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
				};
			} catch (error) {
				return {
					content: [{ type: "text", text: `錯誤: ${error instanceof Error ? error.message : String(error)}` }],
					isError: true,
				};
			}
		},
	);
}
