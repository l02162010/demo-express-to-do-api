# TODO API MCP Server 建置計劃

## 專案概述
為 Express TODO API 建立 Model Context Protocol (MCP) Server，讓 AI 助手能夠透過標準化協議與 TODO API 互動。

## 現有 API 分析

### 現有端點
1. **GET /** - 健康檢查
2. **GET /todos** - 取得待辦事項列表（支援過濾、搜尋、分頁）
3. **GET /todos/:id** - 取得單一待辦事項
4. **POST /todos** - 建立新待辦事項
5. **PUT /todos/:id** - 完整更新待辦事項
6. **PATCH /todos/:id** - 更新待辦事項的局部欄位
7. **DELETE /todos/:id** - 刪除待辦事項

### 資料結構
```json
{
  "id": "uuid",
  "title": "string (必填)",
  "description": "string (選填)",
  "completed": "boolean",
  "dueDate": "ISO string (選填)",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## MCP Server 架構設計

### 1. 技術棧選擇
- **語言**: TypeScript/JavaScript (Node.js)
- **MCP SDK**: @modelcontextprotocol/sdk
- **HTTP 客戶端**: axios 或 fetch
- **傳輸層**: stdio (標準輸入輸出)

### 2. MCP Tools 設計

#### Tool 1: `list_todos`
- **描述**: 取得待辦事項列表
- **參數**:
  - `completed`: boolean (選填) - 過濾完成狀態
  - `search`: string (選填) - 搜尋關鍵字
  - `limit`: number (選填, 預設 50) - 每頁數量
  - `offset`: number (選填, 預設 0) - 偏移量
- **回傳**: 待辦事項列表及分頁資訊

#### Tool 2: `get_todo`
- **描述**: 取得單一待辦事項詳情
- **參數**:
  - `id`: string (必填) - 待辦事項 ID
- **回傳**: 待辦事項完整資訊

#### Tool 3: `create_todo`
- **描述**: 建立新的待辦事項
- **參數**:
  - `title`: string (必填) - 標題
  - `description`: string (選填) - 描述
  - `completed`: boolean (選填, 預設 false) - 完成狀態
  - `dueDate`: string (選填) - 截止日期 (ISO 格式)
- **回傳**: 新建立的待辦事項

#### Tool 4: `update_todo`
- **描述**: 更新待辦事項（局部更新）
- **參數**:
  - `id`: string (必填) - 待辦事項 ID
  - `title`: string (選填) - 新標題
  - `description`: string (選填) - 新描述
  - `completed`: boolean (選填) - 完成狀態
  - `dueDate`: string (選填) - 新截止日期
- **回傳**: 更新後的待辦事項

#### Tool 5: `delete_todo`
- **描述**: 刪除待辦事項
- **參數**:
  - `id`: string (必填) - 待辦事項 ID
- **回傳**: 刪除確認訊息

#### Tool 6: `mark_todo_completed`
- **描述**: 快速標記待辦事項為已完成
- **參數**:
  - `id`: string (必填) - 待辦事項 ID
- **回傳**: 更新後的待辦事項

#### Tool 7: `mark_todo_incomplete`
- **描述**: 快速標記待辦事項為未完成
- **參數**:
  - `id`: string (必填) - 待辦事項 ID
- **回傳**: 更新後的待辦事項

### 3. MCP Resources 設計

#### Resource 1: `todo://list`
- **描述**: 所有待辦事項的即時列表
- **類型**: application/json
- **內容**: 包含所有待辦事項的 JSON 陣列

#### Resource 2: `todo://stats`
- **描述**: 待辦事項統計資訊
- **類型**: application/json
- **內容**: 總數、已完成數、未完成數、今日到期數等

### 4. MCP Prompts 設計

#### Prompt 1: `daily_summary`
- **名稱**: 每日待辦事項總結
- **描述**: 產生今日待辦事項的完整報告，包含完成進度和到期提醒
- **參數**: 無
- **提示模板**: 
  ```
  請使用 list_todos 工具取得所有待辦事項，然後：
  1. 統計總數、已完成數、未完成數
  2. 列出今天到期的項目（dueDate 為今天）
  3. 列出已逾期但未完成的項目
  4. 按優先級建議今天應該完成的任務
  請以易讀的格式呈現報告。
  ```

#### Prompt 2: `weekly_plan`
- **名稱**: 本週工作計劃
- **描述**: 規劃並組織本週的待辦事項
- **參數**: 無
- **提示模板**:
  ```
  請使用 list_todos 工具取得所有未完成的待辦事項，然後：
  1. 列出本週到期的項目（dueDate 在本週內）
  2. 識別沒有截止日期但重要的項目
  3. 建議每天的工作分配
  4. 標示可能需要延期的項目
  請製作一個本週工作計劃表。
  ```

#### Prompt 3: `overdue_tasks`
- **名稱**: 逾期任務提醒
- **描述**: 列出所有已逾期的待辦事項並建議處理順序
- **參數**: 無
- **提示模板**:
  ```
  請使用 list_todos 工具取得所有待辦事項，然後：
  1. 篩選出所有 dueDate 早於今天且 completed 為 false 的項目
  2. 按逾期天數排序（最久的在前）
  3. 評估每個任務的緊急程度
  4. 建議處理優先順序和可能的行動方案
  請提供逾期任務報告和建議。
  ```

#### Prompt 4: `quick_add`
- **名稱**: 智能快速新增任務
- **描述**: 用自然語言快速新增待辦事項，自動解析標題、描述和截止日期
- **參數**: 
  - `task_description`: string (必填) - 任務的自然語言描述
- **提示模板**:
  ```
  根據使用者提供的任務描述：「{{task_description}}」
  
  請分析這段描述並：
  1. 提取出簡潔的任務標題（10-50 字）
  2. 提取出詳細描述（如果有）
  3. 識別是否包含日期或時間資訊，轉換為 ISO 格式的 dueDate
  4. 判斷是否為緊急任務
  
  然後使用 create_todo 工具建立這個待辦事項，並向使用者確認已建立的內容。
  ```

#### Prompt 5: `completion_report`
- **名稱**: 完成度分析報告
- **描述**: 分析待辦事項的完成情況並提供統計圖表
- **參數**: 無
- **提示模板**:
  ```
  請使用 list_todos 工具取得所有待辦事項，然後：
  1. 計算整體完成率（已完成 / 總數）
  2. 分析本週完成的任務數量
  3. 統計平均完成時間（從 createdAt 到標記完成的時間）
  4. 列出最近完成的 5 個任務
  5. 提供生產力建議
  
  請製作一份包含數據和視覺化建議的完成度報告。
  ```

#### Prompt 6: `clean_completed`
- **名稱**: 清理已完成任務
- **描述**: 批次刪除已完成的舊任務以保持列表整潔
- **參數**:
  - `days_old`: number (選填, 預設 30) - 刪除幾天前完成的任務
- **提示模板**:
  ```
  請使用 list_todos 工具取得所有已完成的待辦事項（completed = true），然後：
  1. 篩選出 updatedAt 早於 {{days_old}} 天前的項目
  2. 列出這些項目並向使用者確認是否要刪除
  3. 如果使用者確認，使用 delete_todo 工具逐一刪除
  4. 報告刪除的數量和釋放的空間
  
  請謹慎處理並在刪除前請求確認。
  ```

### 5. 設定檔設計

建立 `.env` 或設定檔來管理：
- `TODO_API_URL`: API 基礎 URL (預設: http://localhost:3000)
- `TODO_API_TIMEOUT`: 請求超時時間（預設: 5000ms）

## 實作步驟

### Phase 1: 專案設置
1. 建立 `mcp-server/` 目錄
2. 初始化 Node.js 專案 (`package.json`)
3. 安裝依賴:
   - `@modelcontextprotocol/sdk`
   - `axios`
   - `dotenv`
4. 設定 TypeScript (如使用 TS)

### Phase 2: 核心實作
1. 建立 MCP Server 基礎結構
2. 實作 HTTP 客戶端包裝器（連接 TODO API）
3. 實作 7 個 Tools
4. 實作 2 個 Resources
5. 實作 6 個 Prompts
6. 加入錯誤處理機制

### Phase 3: 測試
1. 單元測試各個 tool 功能
2. 整合測試與 Express API 的互動
3. 使用 MCP Inspector 進行測試

### Phase 4: 文件與部署
1. 撰寫 README.md
2. 建立使用範例
3. 設定 Claude Desktop 整合設定檔
4. 建立 npm scripts 方便啟動

## 目錄結構

```
express-to-do-api/
├── index.js                    # 現有 Express API
├── package.json                # 現有 package.json
├── mcp-server/                 # MCP Server 目錄
│   ├── package.json            # MCP Server 依賴
│   ├── tsconfig.json           # TypeScript 設定 (如使用)
│   ├── src/
│   │   ├── index.ts            # MCP Server 入口
│   │   ├── client.ts           # TODO API 客戶端
│   │   ├── tools.ts            # Tools 實作
│   │   ├── resources.ts        # Resources 實作
│   │   ├── prompts.ts          # Prompts 實作
│   │   └── types.ts            # 型別定義
│   ├── .env.example            # 環境變數範例
│   └── README.md               # MCP Server 文件
└── plan.md                     # 本計劃文件
```

## 成功標準

1. ✅ MCP Server 能夠成功啟動並透過 stdio 通訊
2. ✅ 所有 7 個 tools 都能正確執行並回傳結果
3. ✅ 所有 2 個 resources 都能正確提供資料
4. ✅ 所有 6 個 prompts 都能正確運作並提供有用的模板
5. ✅ 能夠處理 API 錯誤（如 404、驗證失敗等）
6. ✅ 能在 Claude Desktop 或其他 MCP 客戶端中使用
7. ✅ 有完整的錯誤訊息和日誌記錄
8. ✅ 文件齊全，易於其他開發者使用

## 潛在挑戰與解決方案

### 挑戰 1: API Server 需要同時運行
**解決方案**: 在 MCP Server README 中明確說明需要先啟動 Express API

### 挑戰 2: 錯誤處理
**解決方案**: 實作統一的錯誤處理中間件，將 API 錯誤轉換為友善的 MCP 錯誤訊息

### 挑戰 3: 資料驗證
**解決方案**: 在 MCP Server 端也加入基本驗證，提前發現格式錯誤

## 後續增強功能

1. **快取機制**: 對列表查詢加入短期快取
2. **Webhooks**: 監聽 API 變更並主動通知
3. **批次操作**: 支援一次操作多個待辦事項
4. **匯出功能**: 將待辦事項匯出為 Markdown、CSV 等格式
5. **提醒功能**: 根據 dueDate 提供到期提醒
6. **標籤系統**: 擴展 API 支援標籤分類

## 時程估計

- Phase 1: 30 分鐘
- Phase 2: 2-3 小時
- Phase 3: 1-2 小時
- Phase 4: 1 小時

**總計**: 約 4.5-6.5 小時

## 參考資源

- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop MCP 設定指南](https://modelcontextprotocol.io/quickstart/user)
