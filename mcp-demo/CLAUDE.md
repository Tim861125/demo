# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server implementation that provides date and time query functionality. The server communicates via stdio transport using the MCP SDK and follows the JSON-RPC 2.0 protocol.

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

1. **Initializes** an MCP Server instance with name "mcp-date-demo" and version "1.0.0"
2. **Declares capabilities** - currently only `tools`
3. **Registers two request handlers**:
   - `ListToolsRequestSchema`: Returns available tools (currently just the `get-date` tool)
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

### Current Tools

**get-date**: Returns current date/time with optional formatting and timezone support
- **format** (optional): `iso` (default), `locale`, `date-only`, `time-only`, or `timestamp`
- **timezone** (optional): IANA timezone string (e.g., `Asia/Taipei`, `America/New_York`)
- Implementation uses JavaScript Date API with switch statement for format handling (src/index.ts:62-86)

### Tool Definition Pattern

Each tool must have:
- `name`: Unique identifier
- `description`: What the tool does
- `inputSchema`: JSON Schema defining parameters (type, properties, required fields, enum for constrained values)

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
claude mcp add --transport stdio date-demo -- node /path/to/mcp-demo/dist/index.js
```

### Verify Installation
```bash
claude mcp list
```

## Extending the Server

To add a new tool:

1. Add tool definition in the `ListToolsRequestSchema` handler (src/index.ts:23-47)
2. Add a conditional branch in the `CallToolRequestSchema` handler (src/index.ts:50-101)
3. Implement the business logic
4. Return formatted response with `content` array
5. Throw error for unknown tools to maintain error handling pattern

Example pattern from existing `get-date` tool:
- Extract typed arguments from `request.params.arguments` with defaults
- Use switch statement for multi-option logic
- Handle optional parameters (timezone)
- Return text content with descriptive result

## Technical Notes

- **Transport**: StdioServerTransport (stdin/stdout communication)
- **Module system**: ES modules (note `type: "module"` in package.json)
- **TypeScript config**: Targets ES2022 with Node16 module resolution
- **Error handling**: Throws error for unknown tools (src/index.ts:100)
- **Logging**: Server logs to stderr to avoid interfering with stdio protocol (src/index.ts:107)
- **Shebang**: Entry file has `#!/usr/bin/env node` for direct execution
