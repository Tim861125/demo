# Project Overview

This is a simple User management REST API built with Bun, ElysiaJS, and Prisma. It provides basic CRUD (Create, Read, Update, Delete) operations for a `User` model. The database is a simple SQLite database.

The main technologies used are:
- **Runtime:** Bun
- **Web Framework:** ElysiaJS
- **ORM:** Prisma
- **Database:** SQLite
- **Validation:** Zod (schema present but commented out in the main source)
- **Language:** TypeScript

## Building and Running

### 1. Install dependencies:
```bash
bun install
```

### 2. Set up the database:
This command will create the SQLite database file (`prisma/dev.db`) and run migrations to create the `User` table.
```bash
bunx prisma migrate dev
```

### 3. Run the server:
This will start the API server on `http://localhost:3000`.
```bash
bun run index.ts
```

## Development Conventions

### API Testing
The project includes a `test.http` file for testing the API endpoints using the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension in VS Code. With the server running, you can open `test.http` and click "Send Request" for each defined API call.

### Endpoints
- `GET /`: Welcome message.
- `GET /users`: Get all users.
- `GET /users/:id`: Get a user by ID.
- `POST /users`: Create a new user. Expects a JSON body with `email` (string) and an optional `name` (string).
- `PUT /users/:id`: Update a user by ID. Expects a JSON body with an optional `email` and/or `name`.
- `DELETE /users/:id`: Delete a user by ID.

### Database Schema
The `User` model is defined in `prisma/schema.prisma` and has the following fields:
- `id` (Int, auto-incrementing)
- `email` (String, unique)
- `name` (String, optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Code Style
The code is written in TypeScript. The main application logic is in `index.ts`. The project uses `elysia` for routing and handling HTTP requests. Database interactions are managed through `PrismaClient`.
