# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server implementation that provides a simple addition tool. The server communicates via stdio transport using the MCP SDK and follows the JSON-RPC 2.0 protocol.

## Development Commands

### Build
```bash
npm run build
```
Compiles TypeScript to JavaScript in the `dist/` directory.

### Development Mode
```bash
npm run dev
```
Runs TypeScript compiler in watch mode for active development.

### Run Server
```bash
npm start
```
Starts the compiled MCP server (requires `npm run build` first).

## Architecture

### MCP Server Structure

The server is implemented as a single-file application (`src/index.ts`) that:

1. **Initializes** an MCP Server instance with name and version
2. **Declares capabilities** - currently only `tools`
3. **Registers two request handlers**:
   - `ListToolsRequestSchema`: Returns available tools (currently just the `add` tool)
   - `CallToolRequestSchema`: Executes tool calls and returns results

### Communication Flow

```
Claude Code CLI → stdio transport → MCP Server
                                   ↓
                          Request Handler (tools/list or tools/call)
                                   ↓
                          Execute business logic
                                   ↓
                          Return JSON-RPC response
```

### Tool Definition Pattern

Each tool must have:
- `name`: Unique identifier
- `description`: What the tool does
- `inputSchema`: JSON Schema defining parameters (type, properties, required fields)

Tool calls receive `request.params.arguments` typed according to the schema and must return:
```typescript
{
  content: [
    {
      type: "text",
      text: "Result message"
    }
  ]
}
```

## Integration with Claude Code

### Adding the MCP Server
```bash
claude mcp add --transport stdio add-demo -- node /path/to/mcp-demo/dist/index.js
```

### Verify Installation
```bash
claude mcp list
```

## Extending the Server

To add a new tool:

1. Add tool definition in the `ListToolsRequestSchema` handler
2. Add a conditional branch in the `CallToolRequestSchema` handler
3. Implement the business logic
4. Return formatted response with `content` array

Example pattern from existing `add` tool in `src/index.ts:50-64`:
- Extract typed arguments from `request.params.arguments`
- Execute operation
- Return text content with result

## Technical Notes

- **Transport**: StdioServerTransport (stdin/stdout communication)
- **Module system**: ES modules (note `type: "module"` in package.json)
- **TypeScript config**: Targets ES2022 with Node16 module resolution
- **Error handling**: Throws error for unknown tools (src/index.ts:66)
- **Logging**: Server logs to stderr to avoid interfering with stdio protocol (src/index.ts:73)
