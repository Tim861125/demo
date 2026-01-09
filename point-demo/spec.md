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
content-length: 2129
content-type: application/json
date: Fri, 09 Jan 2026 03:42:16 GMT
vary: *

{
  "data": {
    "userId": "08edb146-164a-4a8b-8eb7-9358690fd327",
    "remainingPoints": 5,
    "paidPoints": 2,
    "giftedPoints": 3,
    "overdraftPoints": 0,
    "latestFeatureUsed": "速讀通",
    "latestFeatureUsedTime": "2026-01-09 09:49:55",
    "lastDeductionTime": "2026-01-09 09:49:55",
    "lastDeductionPoints": 1,
    "pointEntries": [
      {
        "id": 72,
        "planId": 14,
        "type": "paid",
        "points": 2,
        "usedPoints": 0,
        "remainingPoints": 2,
        "expiryDate": null,
        "createdAt": "2026-01-09 11:37:34"
      },
      {
        "id": 71,
        "planId": 14,
        "type": "gifted",
        "points": 3,
        "usedPoints": 0,
        "remainingPoints": 3,
        "expiryDate": null,
        "createdAt": "2026-01-09 11:37:26"
      },
      {
        "id": 68,
        "planId": 14,
        "type": "gifted",
        "points": 20,
        "usedPoints": 20,
        "remainingPoints": 0,
        "expiryDate": null,
        "createdAt": "2026-01-08 09:01:14"
      },
      {
        "id": 67,
        "planId": 14,
        "type": "paid",
        "points": 9,
        "usedPoints": 9,
        "remainingPoints": 0,
        "expiryDate": null,
        "createdAt": "2026-01-07 16:27:06"
      },
      {
        "id": 51,
        "planId": 14,
        "type": "gifted",
        "points": 9999,
        "usedPoints": 9999,
        "remainingPoints": 0,
        "expiryDate": null,
        "createdAt": "2025-11-27 14:16:28"
      },
      {
        "id": 50,
        "planId": 14,
        "type": "overdraft",
        "points": 2,
        "usedPoints": 2,
        "remainingPoints": 0,
        "expiryDate": null,
        "createdAt": "2025-11-27 14:14:51"
      },
      {
        "id": 48,
        "planId": 14,
        "type": "gifted",
        "points": 200,
        "usedPoints": 200,
        "remainingPoints": 0,
        "expiryDate": null,
        "createdAt": "2025-11-19 08:59:47"
      },
      {
        "id": 28,
        "planId": 14,
        "type": "paid",
        "points": 6010,
        "usedPoints": 6010,
        "remainingPoints": 0,
        "expiryDate": null,
        "createdAt": "2025-11-11 01:32:57"
      }
    ],
    "latestReplyRecord": {
      "id": 151371,
      "chatId": "1767923394943",
      "promptId": 156,
      "featureName": "速讀通",
      "featureCode": "ai_speed_read",
      "modelName": "cpatonn/Qwen3-30B-A3B-Instruct-2507-AWQ-4bit",
      "inputTokens": 663,
      "outputTokens": 337,
      "created": "2026-01-09 09:49:55"
    },
    "latestTransaction": {
      "id": 5164,
      "planId": 14,
      "changeTypeCode": "deduction",
      "changeTypeName": "點數扣除",
      "pointsChanged": -1,
      "balanceAfter": 0,
      "featureCode": "ai_speed_read",
      "featureName": "速讀通",
      "description": "使用 速讀通 功能",
      "reply_record_id": 151371,
      "createdAt": "2026-01-09 09:49:55"
    },
    "latestTransactionDetail": {
      "id": 3307,
      "pointTransactionId": 5166,
      "pointsEntryId": 72,
      "pointsChange": 2,
      "createdAt": "2026-01-09 11:37:34",
      "pointsEntryType": "paid",
      "pointsEntryPoints": 2
    }
  }
}
```

## 用 vue 搭配 element-plus 將資訊顯示在畫面上面
### 需要能切換兩種模式
- 每秒呼叫一次 api 更新畫面
- 手動呼叫 api 更新畫面