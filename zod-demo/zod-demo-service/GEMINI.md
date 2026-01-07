# GEMINI.md: Project Overview and Instructions

This document provides a comprehensive overview of the `zod-demo-service` project, including its purpose, technologies, and instructions for development and testing.

## Project Overview

This project is a simple User management REST API built with [Bun](https://bun.sh/). It uses the [ElysiaJS](https://elysiajs.com/) framework for routing and handling HTTP requests, and [Prisma](https://www.prisma.io/) as the ORM for interacting with a SQLite database.

The primary goal of this service is to provide basic CRUD (Create, Read, Update, Delete) operations for a `User` entity.

The codebase in `index.ts` includes commented-out sections that show how to integrate [Zod](https://zod.dev/) for request validation, suggesting that this is a potential or intended feature.

### Key Technologies

*   **Runtime:** Bun
*   **Framework:** ElysiaJS
*   **Database ORM:** Prisma
*   **Database:** SQLite
*   **Validation (optional):** Zod

## Building and Running

### 1. Install Dependencies

First, install the necessary project dependencies using Bun.

```bash
bun install
```

### 2. Set Up and Migrate the Database

This project uses Prisma to manage the database schema. Run the following command to create the SQLite database file (`prisma/dev.db`) and apply any pending migrations.

```bash
bunx prisma migrate dev
```

### 3. Run the Server

To start the development server, execute the main application file.

```bash
bun run index.ts
```

The server will start on `http://localhost:3000`.

## API Endpoints & Testing

The project includes a `test.http` file which can be used with a REST Client extension (like the one for VS Code) to test the API endpoints.

The available endpoints are:

| Method | Path          | Description             |
| :----- | :------------ | :---------------------- |
| `GET`  | `/users`      | Get all users.          |
| `GET`  | `/users/:id`  | Get a single user by ID.|
| `POST` | `/users`      | Create a new user.      |
| `PUT`  | `/users/:id`  | Update a user by ID.    |
| `DELETE`| `/users/:id`  | Delete a user by ID.    |

## Development Conventions

*   **Entry Point:** The main application logic is located in `index.ts`.
*   **Database Schema:** The database model is defined in `prisma/schema.prisma`. Any changes to the data model should be made here, followed by a new Prisma migration.
*   **Package Management:** Dependencies are managed via `package.json` and installed with `bun install`. The `bun.lock` file ensures deterministic installs.
*   **Code Style:** The code follows standard TypeScript conventions.
