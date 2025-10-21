# Express TODO API with MCP Server

一個簡單的待辦事項 REST API，配備完整的 Model Context Protocol (MCP) Server，讓 AI 助手能夠智能管理您的待辦事項。

## 📦 專案結構

```
express-to-do-api/
├── index.js                    # Express REST API
├── package.json                # API 依賴
├── mcp-server/                 # MCP Server
│   ├── src/                    # TypeScript 原始碼
│   ├── build/                  # 編譯後的 JS
│   ├── package.json            # MCP Server 依賴
│   └── README.md               # MCP Server 詳細文件
├── plan.md                     # 開發計劃
└── README.md                   # 本文件
```

## 🚀 快速開始

### 1. 安裝依賴

```bash
# 安裝 API 依賴
npm install

# 安裝 MCP Server 依賴
cd mcp-server
npm install
cd ..
```

### 2. 啟動服務

#### 啟動 REST API（必須先啟動）

```bash
npm run dev
```

API 將在 http://localhost:3000 上運行

#### 啟動 MCP Server

在另一個終端視窗：

```bash
cd mcp-server
npm start
```

## 📡 REST API 端點

### 健康檢查
```
GET /
```

### 待辦事項操作
```
GET    /todos              # 取得列表（支援查詢參數：completed, q, limit, offset）
GET    /todos/:id          # 取得單一項目
POST   /todos              # 建立新項目
PUT    /todos/:id          # 完整更新
PATCH  /todos/:id          # 局部更新
DELETE /todos/:id          # 刪除
```

### 資料格式

```json
{
  "id": "uuid",
  "title": "完成專案報告",
  "description": "撰寫 Q4 進度報告",
  "completed": false,
  "dueDate": "2025-10-25T09:00:00.000Z",
  "createdAt": "2025-10-21T10:00:00.000Z",
  "updatedAt": "2025-10-21T10:00:00.000Z"
}
```

## 🤖 MCP Server 功能

### Tools (7 個)
- ✅ 列表查詢、單項查詢
- ✅ 新增、更新、刪除
- ✅ 快速標記完成/未完成

### Resources (2 個)
- 📊 即時待辦事項列表
- 📈 統計資訊

### Prompts (6 個)
- 📅 每日總結
- 📆 週計劃
- ⏰ 逾期提醒
- ⚡ 智能快速新增
- 📊 完成度分析
- 🧹 批次清理

詳細使用方式請參閱 [mcp-server/README.md](./mcp-server/README.md)

## 🔧 整合到 AI 工具

### VS Code 整合

在 VS Code 的 `settings.json` 中加入：

**使用 npx (推薦，無需建置)**:
```json
{
  "mcp.servers": {
    "todo": {
      "command": "npx",
      "args": [
        "-y",
        "--prefix",
        "${workspaceFolder}/mcp-server",
        "tsx",
        "${workspaceFolder}/mcp-server/src/index.ts"
      ],
      "env": {
        "TODO_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

**或使用預先建置的版本**:
```json
{
  "mcp.servers": {
    "todo": {
      "command": "node",
      "args": ["${workspaceFolder}/mcp-server/build/index.js"],
      "env": {
        "TODO_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

💡 **提示**: 
- 使用 `npx tsx` 可以直接執行 TypeScript，無需預先建置
- 使用 `${workspaceFolder}` 可以避免寫死路徑

詳細設定請參閱：[VS Code 設定指南](./mcp-server/VSCODE_SETUP.md)

### Claude Desktop 整合

編輯 Claude Desktop 設定檔，新增：

```json
{
  "mcpServers": {
    "todo": {
      "command": "node",
      "args": [
        "/Users/austin/Documents/sideProject/express-to-do-api/mcp-server/build/index.js"
      ],
      "env": {
        "TODO_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

重新啟動 Claude Desktop

## 📝 使用範例

### 使用 REST API

```bash
# 建立待辦事項
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "完成專案報告",
    "description": "撰寫 Q4 進度報告",
    "dueDate": "2025-10-25T09:00:00.000Z"
  }'

# 取得所有未完成的項目
curl "http://localhost:3000/todos?completed=false"

# 標記為完成
curl -X PATCH http://localhost:3000/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### 使用 Claude（透過 MCP）

```
請列出所有未完成的待辦事項
```

```
幫我建立一個待辦事項：明天下午2點開會討論Q4規劃
```

```
使用 daily_summary 來產生今日報告
```

```
執行 overdue_tasks 檢查有哪些任務逾期了
```

## 🛠️ 開發

### API 開發
- 使用 Express.js
- In-memory 資料庫（重啟會清空）
- 支援 CORS
- 自動請求日誌

### MCP Server 開發
- TypeScript 開發
- 完整型別定義
- 錯誤處理機制
- 支援環境變數設定

## 📚 測試工具

### 測試 REST API
- 使用 Postman Collection（`todo-api.postman_collection.json`）
- 或使用 curl 命令

### 測試 MCP Server
使用 MCP Inspector：
```bash
cd mcp-server
npx @modelcontextprotocol/inspector node build/index.js
```

## 🔍 疑難排解

### API 無法啟動
- 檢查 port 3000 是否被佔用
- 確認已安裝所有依賴

### MCP Server 無法連接 API
- 確認 API 正在運行
- 檢查 `.env` 中的 URL 設定

### Claude Desktop 無法使用
- 確認設定檔路徑正確
- 檢查 MCP Server 已建置（`npm run build`）
- 查看 Claude Desktop 日誌

## 📖 相關資源

- [Express.js 文件](https://expressjs.com/)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop](https://claude.ai/download)

## 📄 授權

MIT
