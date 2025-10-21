# MCP Server 測試指南

## 快速測試 MCP Server

### 1. 使用 MCP Inspector（推薦）

MCP Inspector 是官方提供的測試工具，可以互動式測試所有功能。

```bash
cd mcp-server
npx @modelcontextprotocol/inspector node build/index.js
```

這會開啟一個網頁界面，您可以：
- 查看所有可用的 Tools、Resources 和 Prompts
- 測試每個 Tool 的執行
- 讀取 Resources
- 執行 Prompts

### 2. 測試 Tools

#### 測試 list_todos
```json
{
  "name": "list_todos",
  "arguments": {
    "completed": false,
    "limit": 10
  }
}
```

#### 測試 create_todo
```json
{
  "name": "create_todo",
  "arguments": {
    "title": "測試任務",
    "description": "這是一個測試任務",
    "dueDate": "2025-10-25T09:00:00.000Z"
  }
}
```

#### 測試 mark_todo_completed
```json
{
  "name": "mark_todo_completed",
  "arguments": {
    "id": "your-todo-id-here"
  }
}
```

### 3. 測試 Resources

#### 讀取 todo://list
```json
{
  "uri": "todo://list"
}
```

#### 讀取 todo://stats
```json
{
  "uri": "todo://stats"
}
```

### 4. 測試 Prompts

#### daily_summary
```json
{
  "name": "daily_summary"
}
```

#### quick_add
```json
{
  "name": "quick_add",
  "arguments": {
    "task_description": "明天下午2點開會討論Q4規劃"
  }
}
```

## 整合測試流程

### 步驟 1: 確認 API 運行
```bash
curl http://localhost:3000/
```

應該回傳：
```json
{
  "ok": true,
  "service": "todo-api",
  "version": "1.0.0"
}
```

### 步驟 2: 建立一些測試資料
```bash
# 建立第一個待辦事項
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "完成專案報告",
    "description": "撰寫 Q4 進度報告",
    "dueDate": "2025-10-25T09:00:00.000Z"
  }'

# 建立第二個待辦事項
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "團隊會議",
    "description": "討論下季度計劃",
    "dueDate": "2025-10-22T14:00:00.000Z"
  }'

# 建立一個已完成的任務
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "完成文件審查",
    "description": "已審查完成",
    "completed": true
  }'
```

### 步驟 3: 測試 MCP Server

啟動 MCP Inspector 並測試：

1. **測試 list_todos**
   - 不帶參數：應該列出所有 3 個項目
   - completed=false：應該列出 2 個未完成項目
   - completed=true：應該列出 1 個已完成項目

2. **測試 Resources**
   - 讀取 `todo://list`：應該顯示所有項目
   - 讀取 `todo://stats`：應該顯示統計資訊

3. **測試 Prompts**
   - 執行 `daily_summary`：應該產生今日報告
   - 執行 `overdue_tasks`：檢查逾期任務

## 在 Claude Desktop 中測試

### 設定完成後的測試步驟：

1. **基本查詢**
   ```
   請列出所有待辦事項
   ```

2. **建立任務**
   ```
   幫我建立一個待辦事項：明天下午開會
   ```

3. **使用 Prompt**
   ```
   使用 daily_summary prompt 產生今日報告
   ```

4. **智能新增**
   ```
   用 quick_add 新增：下週一早上10點交報告
   ```

5. **統計資訊**
   ```
   顯示待辦事項的統計資訊
   ```

## 預期結果

### ✅ 成功指標

- MCP Server 啟動時顯示連接成功訊息
- 所有 7 個 Tools 都能執行
- 2 個 Resources 都能讀取
- 6 個 Prompts 都能使用
- 在 Claude Desktop 中能看到 todo 服務
- Claude 能夠理解並執行待辦事項操作

### ❌ 常見問題

1. **無法連接到 API**
   - 確認 Express API 正在運行
   - 檢查 port 3000 是否被佔用

2. **MCP Server 無法啟動**
   - 確認已執行 `npm run build`
   - 檢查 Node.js 版本是否 >= 18

3. **Claude Desktop 看不到服務**
   - 檢查設定檔路徑是否正確
   - 重新啟動 Claude Desktop
   - 查看 Claude Desktop 日誌

## 偵錯技巧

### 查看 MCP Server 日誌

MCP Server 的 console.error 輸出會顯示在：
- 直接執行時：終端視窗
- Claude Desktop：應用程式日誌檔案

### 啟用詳細日誌

在環境變數中設定：
```bash
export DEBUG=*
```

### 測試 API 連線

```bash
# 在 MCP Server 目錄中
node -e "
const axios = require('axios');
axios.get('http://localhost:3000/')
  .then(r => console.log('API OK:', r.data))
  .catch(e => console.error('API Error:', e.message));
"
```

## 進階測試

### 批次操作測試

建立多個待辦事項並測試：
- 搜尋功能
- 分頁功能
- 完成度統計
- 逾期檢測

### 錯誤處理測試

測試錯誤情況：
- 無效的 ID
- 缺少必填欄位
- 無效的日期格式
- API 離線時的處理

## 效能測試

測試大量資料時的表現：
```bash
# 建立 100 個測試任務
for i in {1..100}; do
  curl -X POST http://localhost:3000/todos \
    -H "Content-Type: application/json" \
    -d "{\"title\": \"測試任務 $i\"}"
done
```

然後測試：
- list_todos 的回應速度
- Resources 的載入速度
- 分頁功能是否正常
