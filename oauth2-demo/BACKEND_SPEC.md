# 後端規格：OAuth 2.0 展示應用

本文件定義了與 `FRONTEND_SPEC.md` 配套的後端服務規格，旨在處理 OAuth 2.0 認證流程並為前端提供安全的 API 端點。

## 1. 技術棧 (Technology Stack)

- **執行環境 (Runtime):** Node.js
- **套件管理器 (Package Manager):** Bun
- **Web 框架 (Framework):** Express.js
- **認證中間件 (Auth Middleware):** Passport.js
- **Passport 策略 (Strategy):** passport-google-oauth20 (以 Google 為例)
- **Token 處理:** jsonwebtoken (JWT)
- **跨域資源共享:** cors
- **環境變數管理:** dotenv
- **語言 (Language):** TypeScript

## 2. 專案初始化與設定

1.  **建立 Node.js 專案:**
    ```bash
    mkdir backend && cd backend
    bun init
    bun add typescript @types/node --dev
    # 根據提示產生 tsconfig.json
    ```

2.  **安裝相依套件:**
    ```bash
    # Production Dependencies
    bun add express passport passport-google-oauth20 jsonwebtoken cors dotenv

    # Development Dependencies
    bun add -d @types/express @types/passport @types/passport-google-oauth20 @types/jsonwebtoken @types/cors
    ```

3.  **設定環境變數 (`.env`):**
    在專案根目錄建立 `.env` 檔案，並填入以下變數。你需要先到 Google Cloud Console 建立一個 OAuth 2.0 憑證。

    ```
    # Google OAuth Credentials
    GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
    GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

    # Application URLs
    BACKEND_URL=http://localhost:3000
    FRONTEND_CALLBACK_URL=http://localhost:5173/callback

    # JWT
    JWT_SECRET="A_VERY_SECRET_KEY_FOR_SIGNING_TOKENS"
    ```

## 3. 目錄結構 (Directory Structure)

```
backend/
├── src/
│   ├── config/
│   │   └── passport.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   └── apiRoutes.ts
│   └── server.ts
├── .env
├── package.json
└── tsconfig.json
```

## 4. API 端點與檔案職責

-   **`server.ts`**: 應用程式進入點。初始化 Express 應用、設定 `cors`、載入 Passport、註冊路由，並啟動伺服器。

-   **`config/passport.ts`**: 設定 Passport 的 Google OAuth 2.0 策略。它會定義如何使用 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`，以及在成功從 Google 獲取使用者資料後要執行的回調函式。

-   **`routes/authRoutes.ts`**: 處理所有與認證相關的路由。
    -   **`GET /auth/login`**
        -   **職責:** OAuth 流程的起點。
        -   **流程:** 當前端的 `login()` action 呼叫此端點時，後端使用 `passport.authenticate('google', { scope: ['profile', 'email'] })` 將使用者重導向到 Google 的授權頁面。
        -   **Google 設定:** 在 Google Cloud Console 中，必須將 `BACKEND_URL/auth/callback` 設定為「已授權的重新導向 URI」。

    -   **`GET /auth/callback`**
        -   **職責:** 處理 Google 授權成功後的回調。
        -   **流程:**
            1.  Google 將使用者重導向至此，並附帶一個 `code`。
            2.  Passport 中間件會自動攔截此請求，並在背景用 `code` 與 Google 交換 `access_token` 和使用者個人資料。
            3.  在 Passport 策略的回調函式中，我們取得 Google 回傳的個人資料 (profile)。
            4.  根據 profile 尋找或建立本地使用者紀錄（在本次練習中可省略資料庫操作）。
            5.  使用 `jsonwebtoken` 簽發一個我們自己的 API Token (JWT)，其中包含使用者的基本資訊 (如 id, name, email)。
            6.  將使用者重導向回前端的 `FRONTEND_CALLBACK_URL`，並將 JWT 作為查詢參數附加，例如：`http://localhost:5173/callback?token=<generated_jwt>`。

-   **`routes/apiRoutes.ts`**: 處理受保護的 API 資源。
    -   **`GET /api/profile`**
        -   **職責:** 提供登入用戶的個人資料。
        -   **保護:** 此路由將使用一個認證中間件 (`middleware/auth.ts`) 來保護。
        -   **流程:**
            1.  前端發送請求時，需在 `Authorization` 標頭中包含 `Bearer <jwt>`。
            2.  認證中間件驗證 JWT 的有效性。如果無效或過期，回傳 401 Unauthorized。
            3.  如果 JWT 有效，從 token 中解析出使用者資訊，並將其回傳給前端。

-   **`middleware/auth.ts`**: Express 中間件，用於保護路由。
    -   **職責:** 檢查請求標頭中是否存在有效的 JWT。
    -   **流程:** 從 `Authorization` 標頭中提取 token，使用 `jsonwebtoken` 和 `JWT_SECRET` 進行驗證，並將解碼後的使用者資訊附加到請求物件上 (e.g., `req.user`) 以供後續路由使用。

## 5. 認證流程 (Backend Flow)

1.  前端呼叫 `GET /auth/login`。
2.  後端將使用者重導向至 Google 進行授權。
3.  Google 授權後，將使用者重導向至後端的 `GET /auth/callback`。
4.  後端在此路由中透過 Passport 與 Google 交換 `code`，獲取使用者資料，然後簽發一個自己的 JWT。
5.  後端將使用者重導向回前端的 `http://localhost:5173/callback?token=<jwt>`。
6.  前端從 URL 取得 JWT，儲存它，並用它來向後端的 `/api/profile` 請求受保護的資源。
