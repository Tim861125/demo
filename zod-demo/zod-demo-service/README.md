# zod-demo-service

This is a simple User management API built with Bun, ElysiaJS, and Prisma.

## Prerequisites

Make sure you have [Bun](https://bun.sh/) installed on your system.

## Getting Started

Follow these steps to get the project up and running:

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd zod-demo-service
```

### 2. Install dependencies

This will install all the necessary packages, including Elysia, Prisma, and Zod.

```bash
bun install
```

### 3. Set up the database

This command will create the SQLite database and run the necessary migrations to create the `User` table.

```bash
bunx prisma migrate dev
```

### 4. Run the server

This will start the API server on `http://localhost:3000`.

```bash
bun run index.ts
```

The server is now running and ready to accept requests.

## Testing the API

This project includes a `test.http` file for easy testing with the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension in VS Code.

1.  Make sure the server is running.
2.  Open the `test.http` file in VS Code.
3.  Click the "Send Request" button above each request to test the different API endpoints.

This provides a convenient way to test creating, reading, updating, and deleting users.

---
_This project was created using `bun init`._