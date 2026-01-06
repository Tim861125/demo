# MCP Add Demo

一個簡單的 MCP (Model Context Protocol) 伺服器示例，提供兩個數字相加的功能。

## 功能

- `add(a, b)`: 將兩個數字相加並返回結果

## 安裝

```bash
npm install
```

## 編譯

```bash
npm run build
```

## 使用方式

### 1. 在 Claude Code CLI 中使用

使用 `claude mcp add` 命令添加 MCP 服務器：

```bash
claude mcp add --transport stdio add-demo -- node /home/wuxinding/tim/demo/mcp-demo/dist/index.js
```

驗證配置：
```bash
claude mcp list
```

測試範例：
- "請幫我計算 5 + 3"
- "使用 add 工具計算 100 加 200"

### 2. 在 Claude Desktop 中使用

編輯 Claude Desktop 配置文件：

- **MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

添加以下配置（請將路徑改為你的實際路徑）：

```json
{
  "mcpServers": {
    "add-demo": {
      "command": "node",
      "args": ["/home/wuxinding/tim/demo/mcp-demo/dist/index.js"]
    }
  }
}
```

### 3. 開發模式

```bash
npm run dev
```

### 4. 直接運行

```bash
npm start
```

## 項目結構

```
mcp-demo/
├── src/
│   └── index.ts          # MCP 伺服器主文件
├── dist/                 # 編譯後的文件
├── package.json          # 項目配置
├── tsconfig.json         # TypeScript 配置
└── README.md            # 說明文件
```

## 技術棧

- TypeScript
- Node.js
- @modelcontextprotocol/sdk
