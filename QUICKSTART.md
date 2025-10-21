# 🚀 快速開始指南

## 10 分鐘快速上手 TODO MCP Server

### 步驟 1: 確認環境 (1 分鐘)

確認您已安裝：
- Node.js >= 18
- npm
- Claude Desktop（如需 AI 助手整合）

```bash
node --version
npm --version
```

### 步驟 2: 安裝依賴 (2 分鐘)

```bash
# 在專案根目錄
npm install

# 安裝 MCP Server 依賴
cd mcp-server
npm install
cd ..
```

### 步驟 3: 啟動 API Server (1 分鐘)

開啟**第一個終端視窗**：

```bash
npm run dev
```

看到以下訊息表示成功：
```
✅ ToDo API listening on http://localhost:3000
```

### 步驟 4: 測試 API (1 分鐘)

開啟**第二個終端視窗**，測試 API：

```bash
curl http://localhost:3000/
```

應該看到：
```json
{"ok":true,"service":"todo-api","version":"1.0.0"}
```

### 步驟 5: 建立測試資料 (1 分鐘)

```bash
# 建立第一個待辦事項
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"測試任務","description":"這是測試"}'
```

### 步驟 6: 整合到 AI 工具 (4 分鐘)

#### 選項 A: VS Code（推薦）

1. **複製設定檔**
   ```bash
   cp .vscode/settings.json.example .vscode/settings.json
   ```

2. **重新載入 VS Code**
   - `Cmd+Shift+P` → 輸入 "Reload Window"

3. **檢查 MCP 狀態**
   - 查看狀態列的 MCP 圖示
   - 應該會顯示 "todo" 服務已連接

📖 詳細設定請參閱：[VS Code 設定指南](./mcp-server/VSCODE_SETUP.md)

#### 選項 B: Claude Desktop

1. **編輯設定檔**

   macOS:
   ```bash
   open ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

   Windows:
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. **加入以下設定**

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

   ⚠️ **重要**: 請將路徑改為您的實際專案路徑！

3. **重新啟動 Claude Desktop**

   完全關閉並重新開啟 Claude Desktop。

### 步驟 7: 測試整合

#### 在 VS Code 中測試

1. 開啟 Copilot Chat
2. 嘗試以下指令：

```
@workspace 請列出所有待辦事項
```

```
@workspace 幫我建立一個待辦事項：明天下午2點開會
```

```
@workspace 使用 daily_summary prompt 產生今日報告
```

#### 在 Claude Desktop 中測試

```
請列出所有待辦事項
```

```
幫我建立一個待辦事項：明天下午2點開會
```

```
使用 daily_summary prompt 產生今日報告
```

## ✅ 成功標誌

您應該能看到：
1. ✅ API 在 http://localhost:3000 運行
2. ✅ Claude Desktop 顯示 "todo" 服務已連接
3. ✅ Claude 能夠執行待辦事項操作
4. ✅ 可以建立、查詢、更新、刪除待辦事項

## 🎯 下一步

### 探索 Tools
- `list_todos` - 查詢列表
- `create_todo` - 建立任務
- `update_todo` - 更新任務
- `mark_todo_completed` - 標記完成

### 使用 Prompts
- `daily_summary` - 每日總結
- `quick_add` - 智能新增（自然語言）
- `overdue_tasks` - 檢查逾期任務

### 讀取 Resources
```
顯示 todo://stats 的內容
```

## ❓ 遇到問題？

### API 無法啟動
```bash
# 檢查 port 3000 是否被佔用
lsof -i :3000

# 如果被佔用，終止該進程或使用其他 port
PORT=3001 npm run dev
```

### Claude Desktop 看不到服務
1. 檢查設定檔路徑是否正確
2. 確認已執行 `cd mcp-server && npm run build`
3. 完全關閉並重啟 Claude Desktop
4. 查看 Claude Desktop 日誌

### MCP Server 無法連接 API
1. 確認 API 正在運行（步驟 3）
2. 檢查 `.env` 中的 URL 設定
3. 測試 API 連線：`curl http://localhost:3000/`

## 📚 更多資訊

- [完整使用文件](./README.md)
- [MCP Server 文件](./mcp-server/README.md)
- [測試指南](./mcp-server/TESTING.md)
- [專案總結](./PROJECT_SUMMARY.md)

## 🎉 恭喜！

您已成功設定 TODO MCP Server！現在可以透過 AI 助手管理您的待辦事項了。

---

**需要幫助？** 查看文件或回報問題。
