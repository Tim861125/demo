# Gemini
## Project Overview

This is a simple Node.js project written in TypeScript that implements a Model Context Protocol (MCP) server. The server exposes a single tool named `add` that takes two numbers, `a` and `b`, as input and returns their sum. The primary purpose of this project is to serve as a demonstration of a basic MCP server.

The project uses the `@modelcontextprotocol/sdk` for handling the MCP communication, `typescript` for type safety, and `ts-node` for running the TypeScript code directly.

## Building and Running

### Installation

To install the dependencies, run:

```bash
npm install
```

### Building the project

To compile the TypeScript code to JavaScript, run:

```bash
npm run build
```

This will create a `dist` directory with the compiled JavaScript files.

### Running the server

There are two ways to run the server:

1.  **Development mode:** This will watch for changes in the `src` directory and automatically recompile the code.

    ```bash
    npm run dev
    ```

2.  **Production mode:** This will run the compiled JavaScript code.

    ```bash
    npm start
    ```

## Development Conventions

### Code Style

The codebase is written in TypeScript and follows standard TypeScript and Node.js conventions. It uses ES modules (`import`/`export`).

### Project Structure

-   `src/index.ts`: The main entry point of the application. It initializes the MCP server, defines the `add` tool, and handles tool calls.
-   `dist/`: Contains the compiled JavaScript code.
-   `package.json`: Defines the project's dependencies, scripts, and metadata.
-   `tsconfig.json`: The configuration file for the TypeScript compiler.

### Architecture

The project follows a simple architecture:

1.  **Server Initialization:** An MCP server is created using the `@modelcontextprotocol/sdk`.
2.  **Tool Definition:** The `add` tool is defined with its name, description, and input schema.
3.  **Request Handling:** The server listens for `ListTools` and `CallTool` requests.
    -   `ListTools`: Returns the list of available tools (in this case, only the `add` tool).
    -   `CallTool`: When the `add` tool is called, it extracts the input arguments, performs the addition, and returns the result.
4.  **Transport:** The server uses `StdioServerTransport` to communicate over standard input/output.
