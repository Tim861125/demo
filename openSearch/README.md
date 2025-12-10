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



  这个 docker-compose.yml 文件定义了一个完整的 OpenSearch 开发环境，包含两个服务：搜索引擎和可视化界面。

  整体架构

  opensearch-node (9200, 9600)
         ↕
  opensearch-dashboards (5601)

  ---
  服务 1: opensearch-node (搜索引擎核心)

  基本信息：
  - 镜像：opensearchproject/opensearch:3.2.0 - 使用官方 OpenSearch 3.2.0 版本
  - 容器名：opensearch-node - 便于识别和管理

  环境变量配置：

  1. discovery.type=single-node
    - 设定为单节点模式
    - 不需要集群发现机制，适合开发测试
  2. node.roles=master,data,ml
    - master: 管理集群状态、分片分配
    - data: 存储数据并执行搜索查询
    - ml: 支持机器学习功能
    - 单节点身兼三职，生产环境通常会分开
  3. OPENSEARCH_INITIAL_ADMIN_PASSWORD=1qaz2wsx!QAZ@WSX
    - 设定管理员初始密码
    - ⚠️ 仅供开发使用，不应用于生产环境
  4. DISABLE_SECURITY_PLUGIN=true
    - 关闭安全插件（不需要认证、加密）
    - 开发时方便但不安全，生产环境应该启用

  数据持久化：
  volumes:
    - ./data:/usr/share/opensearch/data
  - 将本地 ./data 目录映射到容器内的数据目录
  - 容器重启后数据不会丢失
  - 可用 just reset 清除所有数据

  端口映射：
  - 9200: REST API 主要端口（查询、索引、管理）
  - 9600: Performance Analyzer 性能分析端口

  ---
  服务 2: opensearch-dashboards (可视化界面)

  基本信息：
  - 镜像：opensearchproject/opensearch-dashboards:3.2.0
  - 容器名：opensearch-dashboards
  - 版本匹配：必须与 OpenSearch 版本一致（3.2.0）

  端口配置：
  ports:
    - 5601:5601  # 映射到主机
  expose:
    - "5601"     # 暴露给其他容器
  - 通过 http://localhost:5601 访问可视化界面

  环境变量配置：

  1. OPENSEARCH_HOSTS='["http://opensearch-node:9200"]'
    - 告诉 Dashboards 连接到哪个 OpenSearch 节点
    - 使用 Docker 内部网络名称 opensearch-node
    - 支持连接多个节点（数组格式）
  2. DISABLE_SECURITY_DASHBOARDS_PLUGIN="true"
    - 关闭 Dashboards 的安全插件
    - 与 OpenSearch 的安全设置保持一致
    - 无需登录即可访问（仅开发环境）

  ---
  工作流程

  1. 启动：docker compose up -d
    - Docker 创建内部网络
    - 启动 opensearch-node（先启动，因为 dashboards 依赖它）
    - 启动 opensearch-dashboards 并连接到 node
  2. 运行时：
    - OpenSearch 监听 9200/9600 端口
    - Dashboards 通过内部网络访问 http://opensearch-node:9200
    - 用户通过浏览器访问 http://localhost:5601
    - 数据写入 ./data 目录持久化
  3. 停止：docker compose down
    - 停止并移除容器
    - 数据保留在 ./data 目录