# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **OAuth 2.0 demonstration application** implementing Google OAuth authentication. It consists of:
- **Backend** (this directory): Express.js + Passport.js + JWT
- **Frontend** (../frontend): Vue 3 + Pinia + Vue Router

The backend handles OAuth flow with Google, issues JWTs for authenticated sessions, and provides protected API endpoints.

## Development Commands

```bash
# Install dependencies
bun install

# Development mode (hot reload enabled)
bun run dev

# Production mode
bun run start

# Server runs on http://localhost:3000
```

## Architecture

### OAuth 2.0 Flow Implementation

The application implements the Authorization Code flow:

1. **Login Initiation** (`GET /auth/login`): Redirects user to Google's authorization page
2. **OAuth Callback** (`GET /auth/callback`): Receives authorization code from Google, exchanges it for user profile, generates JWT
3. **Frontend Redirect**: Backend redirects to frontend callback URL with JWT as query parameter
4. **API Access**: Frontend uses JWT to access protected endpoints

### Key Components

**`src/server.ts`**
- Application entry point
- Initializes Express, CORS, Passport
- Registers routes for auth and API endpoints
- CORS configured to allow frontend origin (FRONTEND_URL)

**`src/config/passport.ts`**
- Configures Google OAuth 2.0 strategy
- Processes Google profile data and creates user object
- User object structure: `{id, name, email, avatar}`
- Note: No database persistence in this demo; user data extracted directly from Google profile

**`src/middleware/auth.ts`**
- JWT verification middleware for protected routes
- Extracts token from `Authorization: Bearer <token>` header
- Validates JWT using JWT_SECRET
- Attaches decoded user data to `req.user`
- Returns 401 for missing/invalid/expired tokens

**`src/routes/authRoutes.ts`**
- `GET /auth/login`: Initiates OAuth flow with Google (scope: profile, email)
- `GET /auth/callback`: Passport handles Google callback, generates JWT, redirects to `FRONTEND_CALLBACK_URL?token=<jwt>`

**`src/routes/apiRoutes.ts`**
- `GET /api/profile`: Protected endpoint returning user profile from JWT
- Uses `authMiddleware` for authentication

### Environment Variables (.env)

Required variables (see BACKEND_SPEC.md for details):
- `GOOGLE_CLIENT_ID`: OAuth client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: OAuth client secret
- `BACKEND_URL`: Backend URL (default: http://localhost:3000)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)
- `FRONTEND_CALLBACK_URL`: Frontend callback route (default: http://localhost:5173/callback)
- `JWT_SECRET`: Secret key for signing JWT tokens
- `JWT_EXPIRY`: Token expiration (optional, default: 24h)
- `PORT`: Server port (optional, default: 3000)

### Google Cloud Console Setup

To configure OAuth credentials:
1. Create project in Google Cloud Console
2. Enable Google+ API (or Google People API)
3. Create OAuth 2.0 credentials (Web application type)
4. Add authorized redirect URI: `http://localhost:3000/auth/callback`
5. Copy Client ID and Client Secret to .env

### Token Flow

- **Access Token from Google**: Used internally by Passport to fetch user profile, not exposed to frontend
- **JWT Token**: Issued by backend after successful OAuth, contains user data, used by frontend for API authentication
- **Token Storage**: Frontend stores JWT in localStorage and includes it in Authorization header for API requests

### TypeScript Configuration

- Target: ES2020
- Module: ESNext
- Uses Bun runtime with native TypeScript support
- Express Request interface extended globally to include `user` property (src/middleware/auth.ts)

## Common Patterns

### Adding Protected Endpoints

1. Import `authMiddleware` from `src/middleware/auth.ts`
2. Apply to route: `router.get('/endpoint', authMiddleware, handler)`
3. Access authenticated user via `req.user`

### Modifying User Data Structure

If changing user object shape:
1. Update interface in `src/middleware/auth.ts` (global Express.Request extension)
2. Update user creation in `src/config/passport.ts`
3. Update JWT payload generation in `src/routes/authRoutes.ts`
4. Coordinate with frontend: update User interface in `../frontend/src/stores/auth.ts`

## Related Documentation

- See `BACKEND_SPEC.md` in project root for detailed backend specification
- See `FRONTEND_SPEC.md` in project root for frontend architecture
- See `../frontend/CLAUDE.md` for frontend-specific guidance
