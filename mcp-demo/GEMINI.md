# Gemini Code Assistant Context: mcp-demo

## Project Overview

This project is a simple Node.js and TypeScript-based server that implements the Model Context Protocol (MCP). Its primary function is to provide a `get-date` tool that allows a connected model (like an LLM) to query the current date and time with various formatting and timezone options.

The project is split into two main components:

1.  **MCP Server (`src/index.ts`):** The core application that runs as a service, listens for requests over STDIO, and exposes the `get-date` tool according to the MCP specification. It uses the `@modelcontextprotocol/sdk`.

2.  **VLLM Test Client (`src/vllm-client.ts`):** A command-line utility for development and testing. It simulates an LLM client that can connect to an OpenAI-compatible API (like VLLM). This client has its own implementation of the tool's logic, allowing developers to test the tool's behavior in an LLM function-calling context without needing to connect to the actual MCP server.

## Building and Running

### Prerequisites

- Node.js
- npm

### Installation

Install the necessary dependencies from `package.json`:

```bash
npm install
```

### Building

The project is written in TypeScript and must be compiled to JavaScript.

```bash
# Compile the TypeScript code to the dist/ directory
npm run build

# For development, compile in watch mode
npm run dev
```

### Running the Application

There are two main ways to run the project:

1.  **Run the MCP Server:** This starts the actual server that a production client would connect to.

    ```bash
    # Runs the compiled server from dist/index.js
    npm start
    ```
    The server will listen for requests on standard I/O.

2.  **Run the VLLM Test Client:** This runs the test client for development purposes, which will send a query to a configured LLM endpoint and execute the tool logic locally.

    ```bash
    # Runs the test client from dist/vllm-client.js
    npm run client
    ```

## Development Conventions

- **Technology Stack:** The project uses Node.js and TypeScript. All dependencies are managed in `package.json`.
- **Typing:** The codebase is strongly typed using TypeScript. Key data structures for the MCP and VLLM client are defined in `src/types.ts`.
- **Architecture:**
    - The main MCP server logic is self-contained in `src/index.ts`.
    - The test client is separated into `src/vllm-client.ts` (client logic), `src/tool-executor.ts` (tool implementation for the client), and `src/tool-converter.ts` (converts tool definitions to OpenAI format).
- **Redundant Logic for Testing:** A key pattern in this project is the duplication of the `get-date` tool's definition and implementation. It exists once for the MCP server (`src/index.ts`) and is re-implemented for the VLLM test client (`src/tool-executor.ts` and `src/tool-converter.ts`). This allows the test client to be a self-contained testing harness, independent of the running MCP server.
- **Configuration:** The VLLM test client's configuration (API endpoint, model name) is hardcoded in `src/vllm-client.ts`. The MCP server itself requires no special configuration.
