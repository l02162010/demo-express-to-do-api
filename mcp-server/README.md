# TODO MCP Server

Model Context Protocol (MCP) Server for Express TODO API，讓 AI 助手能夠透過標準化協議管理待辦事項。

## 功能特色

### 🛠️ Tools (7 個)
- `list_todos` - 取得待辦事項列表（支援過濾、搜尋、分頁）
- `get_todo` - 取得單一待辦事項詳情
- `create_todo` - 建立新的待辦事項
- `update_todo` - 更新待辦事項（局部更新）
- `delete_todo` - 刪除待辦事項
- `mark_todo_completed` - 快速標記為已完成
- `mark_todo_incomplete` - 快速標記為未完成

### 📚 Resources (2 個)
- `todo://list` - 所有待辦事項的即時列表
- `todo://stats` - 統計資訊（總數、完成數、今日到期等）

### 💡 Prompts (6 個)
- `daily_summary` - 每日待辦事項總結報告
- `weekly_plan` - 本週工作計劃
- `overdue_tasks` - 逾期任務提醒
- `quick_add` - 智能快速新增任務（自然語言解析）
- `completion_report` - 完成度分析報告
- `clean_completed` - 批次清理已完成的舊任務

## 安裝

```bash
npm install
```

## 設定

1. 複製環境變數範例檔案：
```bash
cp .env.example .env
```

2. 編輯 `.env` 檔案設定 API URL（如果需要）：
```env
TODO_API_URL=http://localhost:3000
TODO_API_TIMEOUT=5000
```

## 使用方式

### 前置需求

⚠️ **重要**：在啟動 MCP Server 之前，請先確保 Express TODO API 正在運行！

在專案根目錄執行：
```bash
npm run dev
```

### 啟動 MCP Server

```bash
npm run build
npm start
```

或開發模式（自動重新編譯）：
```bash
npm run dev
```

## 整合設定

### 整合到 VS Code

1. 開啟 VS Code 設定：
   - macOS/Linux: `Code` → `Settings` → `Extensions` → `MCP`
   - Windows: `File` → `Preferences` → `Settings` → `Extensions` → `MCP`
   - 或直接編輯 `settings.json`

2. 在 VS Code 的 `settings.json` 中加入（推薦使用 npx 方式）：

   **方式 1: 使用 npx + tsx (推薦，無需預先建置) ⭐**
   ```json
   {
     "mcp.servers": {
       "todo": {
         "command": "npx",
         "args": [
           "-y",
           "--prefix",
           "/Users/austin/Documents/sideProject/express-to-do-api/mcp-server",
           "tsx",
           "/Users/austin/Documents/sideProject/express-to-do-api/mcp-server/src/index.ts"
         ],
         "env": {
           "TODO_API_URL": "http://localhost:3000"
         }
       }
     }
   }
   ```
   
   優點：直接執行 TypeScript，修改後自動生效，無需建置

   **方式 2: 使用預先建置的 JS**
   ```json
   {
     "mcp.servers": {
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
   
   優點：啟動快速，生產環境推薦（需要先執行 `npm run build`）

   ⚠️ **重要**: 請將路徑改為您的實際專案路徑！

3. 重新載入 VS Code 視窗

### 整合到 Claude Desktop

1. 編輯 Claude Desktop 設定檔：
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. 新增 MCP Server 設定：
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

3. 重新啟動 Claude Desktop

## 使用範例

### 在 Claude 中使用 Tools

```
請幫我列出所有未完成的待辦事項
```

```
請建立一個新的待辦事項：標題是「完成專案報告」，截止日期是明天
```

```
請將 ID 為 xxx 的待辦事項標記為已完成
```

### 使用 Prompts

```
使用 daily_summary prompt 產生今日報告
```

```
用 quick_add prompt 新增任務：明天下午2點開會討論Q4規劃
```

```
執行 overdue_tasks prompt 檢查逾期任務
```

### 讀取 Resources

```
顯示 todo://stats 資源的內容
```

## 開發

### 專案結構

```
mcp-server/
├── src/
│   ├── index.ts        # MCP Server 主程式
│   ├── client.ts       # TODO API 客戶端
│   ├── tools.ts        # Tools 實作
│   ├── resources.ts    # Resources 實作
│   ├── prompts.ts      # Prompts 實作
│   └── types.ts        # 型別定義
├── build/              # 編譯輸出
├── package.json
├── tsconfig.json
└── .env.example
```

### 建置

```bash
npm run build
```

### 測試

可以使用 [MCP Inspector](https://github.com/modelcontextprotocol/inspector) 進行測試：

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

## 疑難排解

### 無法連接到 API

確認：
1. Express TODO API 是否正在運行
2. `.env` 中的 `TODO_API_URL` 是否正確
3. 防火牆或網路設定是否阻擋連線

### VS Code 無法啟動 Server

確認：
1. 已安裝 VS Code 的 MCP 擴充功能
2. `settings.json` 中的路徑是否正確（使用絕對路徑）
3. Node.js 是否已安裝且在 PATH 中
4. 已執行 `npm run build` 建置專案
5. 重新載入 VS Code 視窗 (`Cmd+Shift+P` → `Reload Window`)

### Claude Desktop 無法啟動 Server

確認：
1. `claude_desktop_config.json` 中的路徑是否正確（使用絕對路徑）
2. Node.js 是否已安裝且在 PATH 中
3. 已執行 `npm run build` 建置專案

### Tools 執行錯誤

檢查：
1. API Server 的回應格式是否正確
2. 傳入的參數是否符合 schema
3. 查看 Claude Desktop 的日誌檔案

## 授權

MIT

## 參考資源

- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop](https://claude.ai/download)
