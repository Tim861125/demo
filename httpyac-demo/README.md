# httpyac Demo - HTTP API 测试流程展示

这是一个完整的 httpyac 使用示例项目，展示了如何使用 httpyac 进行 API 测试，包括认证流程、环境变量配置、请求链式调用等功能。

## 项目简介

httpyac 是一个强大的 HTTP 客户端工具，可以在命令行或 VS Code 中使用 .http 文件来测试和调试 REST API。

## 功能展示

### 1. 基础功能
- ✅ 基本的 HTTP 请求 (GET/POST/PUT/PATCH/DELETE)
- ✅ 环境变量和配置管理
- ✅ 请求和响应处理

### 2. 认证流程
- ✅ 用户注册和登录
- ✅ JWT Token 获取和使用
- ✅ Bearer Token 认证
- ✅ 在请求头中使用 Token

### 3. 请求链式调用
- ✅ 从前一个请求中提取数据
- ✅ 将数据传递给后续请求
- ✅ JavaScript 脚本处理响应
- ✅ 动态变量赋值

### 4. 高级功能
- ✅ Pre-request 脚本
- ✅ Response 断言和测试
- ✅ 错误处理
- ✅ 性能测试
- ✅ 自定义 Headers

## 项目结构

```
httpyac-demo/
├── .env                    # 环境变量配置文件
├── .env.example            # 环境变量示例文件
├── .gitignore              # Git 忽略文件
├── httpyac.config.js       # httpyac 配置文件
├── package.json            # 项目配置文件
├── README.md               # 项目说明文档
└── api/
    ├── basic.http          # 基础 HTTP 请求示例
    ├── auth.http           # 认证流程示例
    ├── chain-requests.http # 请求链式调用示例
    └── advanced.http       # 高级功能示例
```

## 安装和使用

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env`（已自动创建）：

```bash
cp .env.example .env
```

### 3. 使用方式

#### 方式一：VS Code 扩展（推荐）

1. 安装 VS Code 扩展: [httpyac](https://marketplace.visualstudio.com/items?itemName=anweber.vscode-httpyac)
2. 打开 `.http` 文件
3. 点击请求上方的 `Send Request` 按钮

#### 方式二：命令行

```bash
# 运行所有测试
npm test

# 运行认证流程测试
npm run test:auth

# 运行链式请求测试
npm run test:chain

# 运行单个文件
npx httpyac send api/basic.http

# 运行单个请求（使用请求名称）
npx httpyac send api/auth.http --name login
```

## API 文件说明

### 📄 basic.http - 基础请求

展示基本的 CRUD 操作：
- GET: 获取用户列表和单个用户
- POST: 创建用户
- PUT: 完整更新用户
- PATCH: 部分更新用户
- DELETE: 删除用户

### 🔐 auth.http - 认证流程

展示完整的认证流程：
1. 用户注册
2. 用户登录获取 Token
3. 提取 Token 到变量
4. 使用 Token 访问受保护资源
5. 带 Token 的各种请求

**关键语法：**
```http
# 登录请求
# @name login
POST {{API_BASE_URL}}/login

# 提取 token
@token = {{login.response.body.token}}

# 使用 token
Authorization: Bearer {{token}}
```

### 🔗 chain-requests.http - 请求链式调用

展示如何将前一个请求的响应传递给下一个请求：

#### 示例 1: 登录后使用 Token
```http
# Step 1: 登录
# @name loginRequest
POST /login

# Step 2: 提取 Token
@authToken = {{loginRequest.response.body.token}}

# Step 3: 使用 Token
Authorization: Bearer {{authToken}}
```

#### 示例 2: 创建资源并获取 ID
```http
# Step 1: 创建文章
# @name createPost
POST /posts

# Step 2: 提取 ID
@postId = {{createPost.response.body.id}}

# Step 3: 使用 ID
POST /posts/{{postId}}/comments
```

#### 示例 3: JavaScript 处理响应
```http
# 获取数据
# @name getUserList
GET /users

# 使用 JavaScript 处理
<?js
const users = response.parsedBody.data;
exports.firstUserId = users[0].id;
exports.firstUserEmail = users[0].email;
?>

# 使用提取的数据
GET /users/{{firstUserId}}
```

### 🚀 advanced.http - 高级功能

展示 httpyac 的高级特性：

#### 1. Pre-request Script
```http
<?js
// 请求前执行
exports.timestamp = Date.now();
exports.randomId = Math.floor(Math.random() * 1000);
?>

POST /users
{
  "id": {{randomId}},
  "timestamp": {{timestamp}}
}
```

#### 2. Response 断言
```http
GET /users/2

<?js
// 响应后执行
test("状态码应该是 200", () => {
  expect(response.statusCode).toBe(200);
});

test("响应应包含 data", () => {
  expect(response.parsedBody.data).toBeDefined();
});
?>
```

#### 3. 错误处理
```http
GET /users/999

<?js
if (response.statusCode === 404) {
  console.log('资源未找到');
} else if (response.statusCode >= 500) {
  console.log('服务器错误');
}
?>
```

## 环境变量使用

### 在 .env 文件中定义
```env
API_BASE_URL=https://reqres.in/api
AUTH_EMAIL=eve.holt@reqres.in
AUTH_PASSWORD=cityslicka
```

### 在 .http 文件中使用
```http
@baseUrl = {{API_BASE_URL}}

POST {{baseUrl}}/login
{
  "email": "{{AUTH_EMAIL}}",
  "password": "{{AUTH_PASSWORD}}"
}
```

## 配置文件说明

### httpyac.config.js

```javascript
module.exports = {
  envDirName: './',
  environments: {
    $default: { env: 'development' },
    development: { API_BASE_URL: '...' },
    production: { API_BASE_URL: '...' }
  },
  request: {
    timeout: 30000,
    followRedirect: true
  }
};
```

## 常用技巧

### 1. 变量引用
```http
# 从响应中提取
@token = {{login.response.body.token}}
@userId = {{createUser.response.body.id}}

# 从环境变量
@baseUrl = {{API_BASE_URL}}

# 手动定义
@apiKey = my-secret-key
```

### 2. JavaScript 脚本
```http
<?js
// Pre-request script (请求前)
exports.timestamp = Date.now();
?>

POST /api
<?js
// Response script (响应后)
const data = response.parsedBody;
exports.id = data.id;

// 断言测试
test("should return 200", () => {
  expect(response.statusCode).toBe(200);
});
?>
```

### 3. 条件执行
```http
<?js
const env = process.env.NODE_ENV;
if (env === 'production') {
  exports.apiUrl = 'https://api.prod.com';
} else {
  exports.apiUrl = 'https://api.dev.com';
}
?>
```

## 使用的公共 API

本项目使用以下公共 API 进行演示：
- [ReqRes](https://reqres.in/) - 用户管理和认证 API
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - 文章和评论 API

## 注意事项

1. **Token 安全**: 不要将真实的 API Token 或密码提交到版本控制系统
2. **环境变量**: 使用 `.env` 文件管理敏感信息，确保 `.env` 在 `.gitignore` 中
3. **请求命名**: 使用 `# @name requestName` 命名请求，方便引用
4. **测试顺序**: 链式请求需要按顺序执行

## VS Code 扩展推荐

- [httpyac](https://marketplace.visualstudio.com/items?itemName=anweber.vscode-httpyac) - HTTP 客户端
- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - 另一个 HTTP 客户端选择

## 学习资源

- [httpyac 官方文档](https://httpyac.github.io/)
- [httpyac GitHub](https://github.com/AnWeber/httpyac)
- [RFC 2616 - HTTP/1.1](https://www.rfc-editor.org/rfc/rfc2616)

## 贡献

欢迎提交 Issue 和 Pull Request！

## License

MIT
