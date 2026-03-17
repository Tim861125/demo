import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { APP_CONFIG } from "./env-manager";
import { registerAllTools } from "./tools";
import { log } from "./utils/logger";

if (!APP_CONFIG.OBSIDIAN.VAULT_PATH) {
	log("ERROR", "未設定 OBSIDIAN_VAULT_PATH 環境變數");
	process.exit(1);
}

const server = new McpServer({
	name: "obsidian-mcp-server",
	version: "1.0.0",
});

registerAllTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
log("INFO", "Obsidian MCP Server 啟動中 (stdio)...");
