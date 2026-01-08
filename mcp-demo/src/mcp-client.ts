import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

/**
 * MCP 伺服器客戶端，以子進程方式運行
 */
export class MCPClient {
  private client: Client;
  private transport!: StdioClientTransport;

  // 構造函數是私有的，因為設置是異步的。請使用 MCPClient.create() 替代。
  private constructor() {
    // 客戶端在此創建，但在異步工廠方法中連接
    this.client = new Client({
        name: "vllm-mcp-client",
        version: "1.0.0"
    });
  }

  /**
   * 異步創建並連接 MCPClient
   */
  static async create(command: string, args: string[]): Promise<MCPClient> {
    const mcpClient = new MCPClient();
    mcpClient.transport = new StdioClientTransport({
      command,
      args,
    });

    // 記錄子進程的 stderr 用於調試
    mcpClient.transport.stderr?.on("data", (data) => {
      console.error(`[MCP Server Process]: ${data}`);
    });

    await mcpClient.client.connect(mcpClient.transport);
    return mcpClient;
  }

  /**
   * 從 MCP 伺服器獲取可用工具列表
   */
  async listTools(): Promise<any> {
    const response = await this.client.listTools();
    return response.tools;
  }

  /**
   * 調用 MCP 伺服器上的工具
   * @param name 要調用的工具名稱
   * @param args 工具的參數
   * @returns 工具返回的內容
   */
  async callTool(name: string, args: any): Promise<any> {
    const response = await this.client.callTool({
      name,
      arguments: args,
    });
    // 假設第一個內容項是主要結果
    return (response as any).content?.[0];
  }

  /**
   * 斷開與 MCP 伺服器的連接並終止子進程
   */
  async disconnect(): Promise<void> {
    await this.client.close();
    console.log("[MCP Client] Disconnected from server.");
  }
}
