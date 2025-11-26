# Gemini Project Context: OAuth2 Demo Backend

## Project Overview

This project is a backend service for a demonstration of OAuth 2.0 authentication. It is built with TypeScript and runs on the Bun runtime. It uses the Express.js framework to provide API endpoints.

The primary function of this service is to handle user authentication via Google's OAuth 2.0 service. It uses Passport.js with the `passport-google-oauth20` strategy to manage the OAuth flow. Upon successful authentication with Google, the service generates a JSON Web Token (JWT) which is then used to authenticate subsequent requests to protected API endpoints.

The project is structured with separate routes for authentication (`/auth`) and API (`/api`), a dedicated middleware for JWT verification, and a configuration file for Passport.js.

## Building and Running

The project's dependencies and scripts are managed via `bun`.

### Key Commands:

*   **Install dependencies:**
    ```bash
    bun install
    ```

*   **Run in development mode (with hot-reloading):**
    ```bash
    bun run dev
    ```

*   **Run in production mode:**
    ```bash
    bun run start
    ```

### Environment Variables:

The application requires environment variables to be set up for Google OAuth and JWT. A `.env` file should be created in the root of the project with the following keys:

```
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
FRONTEND_CALLBACK_URL=http://localhost:5173/callback
JWT_SECRET="a_strong_secret_for_jwt"
JWT_EXPIRY=24h
PORT=3000
```

## Development Conventions

*   **Language:** The project is written in TypeScript.
*   **Framework:** Express.js is used as the web server framework.
*   **Package Manager:** Bun is used for package management and as the runtime.
*   **Authentication:** Authentication is handled in two parts:
    1.  **OAuth 2.0:** Passport.js with the Google strategy is used to authenticate users with their Google account.
    2.  **API Authentication:** JWTs are used to secure protected API endpoints. A custom middleware (`src/middleware/auth.ts`) verifies the token from the `Authorization` header.
*   **Linting/Formatting:** While no explicit linting or formatting configuration is present (e.g. `.eslintrc`, `.prettierrc`), the code follows a consistent style. It is recommended to use a tool like Prettier or ESLint to maintain this consistency.
*   **Testing:** There are no formal test suites (e.g. Jest, Vitest). However, the `authRoutes.ts` file contains a `/test-login` endpoint for development purposes.

## Key Files

*   `src/server.ts`: The main entry point of the application. It initializes the Express server, sets up middleware, and registers the routes.
*   `src/config/passport.ts`: Configures the Passport.js Google OAuth 2.0 strategy.
*   `src/routes/authRoutes.ts`: Defines the routes for the authentication flow, including `/login` (initiates OAuth) and `/callback` (handles the response from Google). It is responsible for generating the JWT.
*   `src/routes/apiRoutes.ts`: Defines the protected API routes. The `/api/profile` endpoint is an example of a route that requires a valid JWT.
*   `src/middleware/auth.ts`: A middleware function that verifies the JWT for protected routes.
*   `package.json`: Defines the project dependencies and scripts.
*   `README.md`: Provides setup and usage instructions for the project.
