# 展示點數詳細頁面規格
- 這是一個用 vue 寫的前端
- 取得一個 api 回傳值放在畫面上展示


## 前端傳送
```
POST http://localhost:3000/api/user/get-user-detail-summary
Content-Type: application/json

{
    "userId": "08edb146-164a-4a8b-8eb7-9358690fd327",
    "applicationName": "IPTech_STD"
}
```

## 後端 api
- http://localhost:3000/api/user/get-user-detail-summary
- 回傳內容
```
HTTP/1.1 200 OK
access-control-allow-credentials: true
access-control-allow-headers: user-agent, content-type, accept, content-length, accept-encoding, host, connection
access-control-allow-methods: POST
access-control-allow-origin: *
access-control-expose-headers: user-agent, content-type, accept, content-length, accept-encoding, host, connection
content-length: 274
content-type: application/json
date: Wed, 07 Jan 2026 08:28:08 GMT
vary: *

{
  "data": {
    "userId": "08edb146-164a-4a8b-8eb7-9358690fd327",
    "remainingPoints": 7,
    "paidPoints": 7,
    "giftedPoints": 0,
    "overdraftPoints": 0,
    "latestFeatureUsed": "檢索通",
    "latestFeatureUsedTime": "2026-01-07 16:27:53",
    "lastDeductionTime": "2026-01-07 16:27:55",
    "lastDeductionPoints": 2
  }
}
```

## 用 vue 搭配 element-plus 將資訊顯示在畫面上面
### 需要能切換兩種模式
- 每秒呼叫一次 api 更新畫面
- 手動呼叫 api 更新畫面