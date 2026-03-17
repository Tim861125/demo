import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObsidianService } from "../services/obsidian-service";
import { log } from "../utils/logger";

export function registerListRecentNotesTool(server: McpServer) {
	server.registerTool(
		"list_recent_notes",
		{
			title: "列出最近筆記",
			description: "列出最近修改的筆記",
			inputSchema: {
				count: z.number().optional().default(10).describe("要列出的數量"),
			},
		},
		async ({ count }) => {
			log("INFO", "Tool: list_recent_notes", { count });
			const notes = await getObsidianService().listRecentNotes(count);
			return {
				content: [{ type: "text", text: JSON.stringify(notes, null, 2) }],
			};
		},
	);
}
