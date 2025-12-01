# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Server-Sent Events (SSE) demo application consisting of two separate projects:
- **sse-backend**: ASP.NET Core 8.0 MVC backend that streams real-time data via SSE
- **sse-frontend**: Vue 3 frontend application that consumes the SSE stream

## Architecture

### Backend (sse-backend)
- **Framework**: ASP.NET Core 8.0 with MVC pattern
- **Key Component**: `SseController` (sse-backend/Controllers/SseController.cs:6) implements SSE endpoint at `/sse/stream`
- **SSE Implementation**: Sets proper headers (Content-Type: text/event-stream, Cache-Control: no-cache, Connection: keep-alive), streams data using `Response.Body.WriteAsync()` followed by `FlushAsync()` to push data immediately without waiting for completion
- **Default URL**: http://localhost:5119 (configured in launchSettings.json)

### Frontend (sse-frontend)
- **Framework**: Vue 3 with Vue CLI 5.0
- **SSE Client**: Uses native browser EventSource API in App.vue:14 to connect to backend endpoint
- **Entry Point**: src/main.js mounts the App.vue component
- **Build Tool**: Vue CLI Service with Babel and ESLint

### Communication Flow
Frontend EventSource connects to backend at `http://localhost:5119/sse/stream`, backend continuously streams messages with timestamp and counter every second, frontend receives and displays messages in real-time.

## Development Commands

### Backend
```bash
cd sse-backend
dotnet run                    # Run the backend server (default: http://localhost:5119)
dotnet build                  # Build the project
dotnet watch run              # Run with hot reload
```

### Frontend
```bash
cd sse-frontend
npm install                   # Install dependencies
npm run serve                 # Start development server with hot reload
npm run build                 # Build for production
npm run lint                  # Run ESLint
```

## Running the Application

1. Start backend: `cd sse-backend && dotnet run`
2. Start frontend: `cd sse-frontend && npm run serve`
3. Frontend will connect to backend SSE endpoint and display real-time messages
