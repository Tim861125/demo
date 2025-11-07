<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# 我想做一個 oauth2.0 的練習, 教我如何展示

你可以透過以下的基本流程來實作並展示 OAuth 2.0 練習：

### OAuth 2.0 角色說明

- Resource Owner（使用者）：擁有資源（帳號資料等）的使用者。
- Client（客戶端）：需要使用資源的應用程式。
- Authorization Server（授權伺服器）：負責使用者認證並發放令牌。
- Resource Server（資源伺服器）：存放受保護的資源，接受憑證存取請求。


### OAuth 2.0 示範流程

1. Client 將使用者引導至授權伺服器進行登入與授權。
2. 授權伺服器認證使用者成功後，回傳授權碼（Authorization Code）給 Client。
3. Client 透過授權碼向授權伺服器請求存取權杖（Access Token）。
4. 授權伺服器驗證後發出 Access Token。
5. Client 使用 Access Token 向資源伺服器取得受保護資源。

### 簡易練習展示建議

- 建立兩個簡單架構：
    - Client：一個網頁應用，負責導向登入、取得授權碼並用來換取 Access Token。
    - Resource Server：儲存受保護資料，接收 Access Token 請求並回傳資料。
- 網頁的登入頁、授權頁可簡單模擬或使用第三方服務（如 Google OAuth）。
- 實際程式碼流程會包含重定向、授權碼接收、Token請求這些步驟。