# 前端規格：OAuth 2.0 展示應用

本文件定義了用於 OAuth 2.0 展示應用的前端規格。目標是建立一個清晰、可執行的計畫，以便 AI 助理能夠高效地完成開發。

## 1. 技術棧 (Technology Stack)

- **套件管理器 (Package Manager):** Bun
- **JavaScript 框架 (Framework):** Vue 3
- **路由 (Routing):** Vue Router
- **狀態管理 (State Management):** Pinia
- **樣式 (Styling):** Tailwind CSS
- **HTTP 客戶端 (HTTP Client):** Axios
- **語言 (Language):** TypeScript

## 2. 專案初始化與設定

1.  **建立 Vue 專案:**
    使用以下指令初始化專案，並在互動式提示中啟用 `Vue Router` 和 `Pinia`。

    ```bash
    bun create vue@latest frontend
    ```

2.  **安裝相依套件:**
    進入 `frontend` 目錄後，安裝 `axios` 和 `tailwindcss`。

    ```bash
    cd frontend
    bun add axios
    bun add -d tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

3.  **設定 Tailwind CSS:**
    -   **`tailwind.config.js`:**
        ```javascript
        /** @type {import('tailwindcss').Config} */
        export default {
          content: [
            "./index.html",
            "./src/**/*.{vue,js,ts,jsx,tsx}",
          ],
          theme: {
            extend: {},
          },
          plugins: [],
        }
        ```
    -   **`src/assets/main.css`:**
        ```css
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        ```

## 3. 目錄結構 (Directory Structure)

專案的 `src` 目錄結構應如下：

```
src/
├── assets/
│   └── main.css
├── components/
│   ├── LoginButton.vue
│   └── UserProfile.vue
├── router/
│   └── index.ts
├── services/
│   └── api.ts
├── stores/
│   └── auth.ts
├── views/
│   ├── HomeView.vue
│   ├── CallbackView.vue
│   └── ProfileView.vue
├── App.vue
└── main.ts
```

## 4. 元件與檔案職責

-   **`main.ts`**: 應用程式進入點，初始化 Vue、Pinia 和 Vue Router。

-   **`App.vue`**: 根組件，包含全局佈局和 `<RouterView />`。

-   **`router/index.ts`**:
    -   定義三個路由：
        -   `path: '/'`, `name: 'home'`, component: `HomeView`
        -   `path: '/profile'`, `name: 'profile'`, component: `ProfileView`
        -   `path: '/callback'`, `name: 'callback'`, component: `CallbackView`
    -   設定路由守衛 (Navigation Guard)，保護 `/profile` 路由，如果用戶未登入，則重導向到首頁。

-   **`stores/auth.ts` (Pinia Store)**:
    -   **State**: `isAuthenticated` (boolean), `accessToken` (string | null), `user` (object | null)。
    -   **Actions**:
        -   `login()`: 重導向使用者到後端的 OAuth 授權 URL (`/auth/login`)。
        -   `saveToken(token: string)`: 接收從 `/callback` 頁面傳來的 API Token (JWT)，將其儲存到 state，並更新 `isAuthenticated` 狀態。
        -   `fetchUserProfile()`: 使用 `accessToken` 向後端 API (`/api/profile`) 獲取使用者資料並儲存。
        -   `logout()`: 清除 state 中的所有認證資料。

-   **`views/HomeView.vue`**:
    -   應用程式首頁。
    -   如果使用者未登入 (`isAuthenticated` 為 false)，顯示 `LoginButton` 組件。
    -   如果使用者已登入，顯示歡迎訊息和一個前往個人資料頁 (`/profile`) 的連結。

-   **`views/CallbackView.vue`**:
    -   此頁面用於處理 OAuth 授權後的回調。
    -   在 `onMounted` 生命週期鉤子中，從 URL 查詢參數中取得 `token`。
    -   如果 `token` 存在，則呼叫 Pinia store 中的 `saveToken` action，然後手動重導向到 `/profile` 頁面。
    -   顯示 "驗證成功，正在跳轉..." 或類似的載入訊息。

-   **`views/ProfileView.vue`**:
    -   受保護的頁面，僅限登入用戶訪問。
    -   進入頁面時，如果 Pinia store 中尚無使用者資料，則呼叫 `fetchUserProfile` action。
    -   顯示 `UserProfile` 組件來呈現使用者資訊。
    -   提供一個登出按鈕，點擊後呼叫 Pinia store 中的 `logout` action 並重導向到首頁。

-   **`components/LoginButton.vue`**:
    -   一個簡單的按鈕。
    -   點擊時，觸發 Pinia store 中的 `login` action。

-   **`components/UserProfile.vue`**:
    -   接收一個 `user` 物件作為 prop。
    -   顯示使用者的基本資訊，例如姓名、Email 和頭像。

-   **`services/api.ts`**:
    -   建立並導出一個 `axios` 實例。
    -   設定 `baseURL` 為後端 API 的位址 (例如 `http://localhost:3000`)。
    -   使用 `axios` 的請求攔截器 (Request Interceptor)，在每個請求的標頭 (Header) 中自動加入 `Authorization: Bearer <accessToken>`（如果 `accessToken` 存在於 Pinia store 中）。

## 5. OAuth 流程 (Frontend Flow)

1.  使用者訪問首頁 (`/`)，看到登入按鈕。
2.  使用者點擊登入，`login()` action 觸發，頁面重導向至後端提供的授權頁面 (`/auth/login`)。
3.  使用者在授權頁面登入並同意授權。
4.  授權成功後，後端會處理完與第三方服務 (如 Google) 的所有通訊，然後將使用者重導向回前端的 `/callback` 頁面，並附上最終的 API Token (JWT) 作為查詢參數 (例如 `?token=...`)。
5.  `CallbackView` 組件從 URL 取得 `token`，並呼叫 `saveToken` action 將其儲存到 Pinia store 中。
6.  儲存 `token` 後，`CallbackView` 將使用者重導向到 `/profile` 頁面。
7.  `ProfileView` 組件現在可以使用儲存的 `token`，透過 `fetchUserProfile` action 從後端的 `/api/profile` 獲取並顯示使用者資訊。
