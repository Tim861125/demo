# OAuth 2.0 Demo - Backend

後端服務使用 Express + Passport + JWT 實作 OAuth 2.0 認證流程。

## 技術棧

- **Runtime**: Bun
- **Framework**: Express.js
- **Auth**: Passport.js (Google OAuth 2.0)
- **Token**: JWT (jsonwebtoken)
- **Language**: TypeScript

## 設定步驟

### 1. 安裝依賴

```bash
bun install
```

### 2. 設定 Google OAuth 憑證

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用 Google+ API
4. 建立 OAuth 2.0 憑證：
   - 應用程式類型：Web 應用程式
   - 已授權的重新導向 URI：`http://localhost:3000/auth/callback`

### 3. 設定環境變數

編輯 `.env` 檔案，填入你的 Google OAuth 憑證：

```env
GOOGLE_CLIENT_ID="your_actual_client_id"
GOOGLE_CLIENT_SECRET="your_actual_client_secret"

# 其他設定保持預設即可
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
FRONTEND_CALLBACK_URL=http://localhost:5173/callback

JWT_SECRET="A_VERY_SECRET_KEY_FOR_SIGNING_TOKENS"
JWT_EXPIRY=24h

PORT=3000
```

### 4. 啟動伺服器

```bash
# 開發模式（支援熱重載）
bun run dev

# 生產模式
bun run start
```

伺服器將在 `http://localhost:3000` 啟動。

## API 端點

### 公開端點

- `GET /` - 根路由，顯示 API 資訊
- `GET /health` - 健康檢查

### 認證端點

- `GET /auth/login` - OAuth 流程起點，重導向至 Google 授權頁面
- `GET /auth/callback` - Google 授權後的回調端點（自動處理）

### 受保護的 API 端點

- `GET /api/profile` - 取得使用者個人資料（需要 JWT）

## OAuth 流程

1. 前端呼叫 `GET /auth/login`
2. 後端將使用者重導向至 Google 授權頁面
3. 使用者登入並同意授權
4. Google 將使用者重導向至 `GET /auth/callback`
5. 後端與 Google 交換 token，取得使用者資料
6. 後端簽發 JWT，並將使用者重導向回前端 `/callback?token=<jwt>`
7. 前端使用 JWT 向 `/api/profile` 請求使用者資料

## 目錄結構

```
backend/
├── src/
│   ├── config/
│   │   └── passport.ts          # Passport Google OAuth 策略設定
│   ├── middleware/
│   │   └── auth.ts               # JWT 驗證中間件
│   ├── routes/
│   │   ├── authRoutes.ts         # 認證相關路由
│   │   └── apiRoutes.ts          # API 路由
│   └── server.ts                 # 應用程式進入點
├── .env                          # 環境變數
├── package.json
└── tsconfig.json
```

## 測試

啟動伺服器後，訪問 `http://localhost:3000` 可以看到 API 資訊。

訪問 `http://localhost:3000/health` 可以檢查伺服器狀態。
