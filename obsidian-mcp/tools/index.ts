import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSearchNotesTool } from "./search-notes";
import { registerReadNoteTool } from "./read-note";
import { registerListRecentNotesTool } from "./list-recent-notes";

export function registerAllTools(server: McpServer) {
	registerSearchNotesTool(server);
	registerReadNoteTool(server);
	registerListRecentNotesTool(server);
}
