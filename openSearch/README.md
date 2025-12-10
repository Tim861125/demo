# OpenSearch Docker 開發環境

## 專案簡介

這個專案提供了一個簡單方便的方式來運行 OpenSearch 和 OpenSearch Dashboards 環境，使用 Docker Compose 進行容器編排。預先配置為單節點設置，非常適合本地開發和測試。

- **OpenSearch:** 分散式開源搜尋和分析引擎
- **OpenSearch Dashboards:** OpenSearch 資料視覺化工具
- **Docker Compose:** 定義和運行多容器 Docker 應用程式
- **Just:** 專案任務命令執行工具

## 環境建置與運行

### 前置需求

- Docker
- Docker Compose
- [Just](https://github.com/casey/just)

### 常用指令

`justfile` 提供了便捷的環境管理指令：

- **初始化資料目錄：**
  ```bash
  just init
  ```

- **啟動服務：**
  ```bash
  docker compose up -d
  ```

- **停止服務：**
  ```bash
  docker compose down
  ```

- **查看服務日誌：**
  ```bash
  docker compose logs -f
  ```

- **重置資料目錄：**
  ```bash
  just reset
  ```

### 服務端點

- OpenSearch API: http://localhost:9200
- OpenSearch 效能分析器: http://localhost:9600
- OpenSearch Dashboards: http://localhost:5601

## 開發慣例

- 專案特定指令定義在 `justfile` 中。使用 `just` 命令可以查看所有可用指令
- OpenSearch 資料持久化在 `./data` 目錄
- OpenSearch 管理員密碼設定在 `docker-compose.yml` 中。開發環境使用密碼為：`1qaz2wsx!QAZ@WSX`
- 為了開發便利性，OpenSearch 和 OpenSearch Dashboards 預設停用安全性功能

## 配置說明

### 單節點設置

此環境配置為單節點模式，適合本地開發：
- 節點角色：master, data, ml
- 發現類型：single-node
- 安全插件：已停用

### 資料持久化

所有 OpenSearch 資料儲存在 `./data` 目錄，該目錄掛載到容器的 `/usr/share/opensearch/data`。此目錄已加入 `.gitignore`，可使用 `just reset` 完全清除重置。
