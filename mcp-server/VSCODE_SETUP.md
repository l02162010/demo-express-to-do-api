# VS Code MCP 整合指南

## 在 VS Code 中使用 TODO MCP Server

本指南將幫助您在 Visual Studio Code 中設定並使用 TODO MCP Server。

## 前置需求

### 1. 安裝 VS Code MCP 擴充功能

在 VS Code 中：
1. 開啟擴充功能面板 (`Cmd+Shift+X` 或 `Ctrl+Shift+X`)
2. 搜尋 "Model Context Protocol" 或 "MCP"
3. 安裝官方的 MCP 擴充功能

或者在命令列安裝：
```bash
code --install-extension modelcontextprotocol.mcp
```

### 2. 確認 TODO API 正在運行

在專案根目錄執行：
```bash
npm run dev
```

確認看到：
```
✅ ToDo API listening on http://localhost:3000
```

### 3. 建置 MCP Server (使用 npx 方式可跳過此步驟)

如果使用 `node` 執行預先建置的版本，需要先建置：

```bash
cd mcp-server
npm run build
```

如果使用 `npx tsx` 方式，可以直接跳過此步驟，因為會直接執行 TypeScript 原始碼。

## 設定步驟

### 方法 1: 使用 VS Code 設定介面

1. **開啟設定**
   - macOS: `Code` → `Settings` (或 `Cmd+,`)
   - Windows/Linux: `File` → `Preferences` → `Settings` (或 `Ctrl+,`)

2. **搜尋 MCP**
   - 在設定搜尋框中輸入 "mcp"
   - 找到 "MCP: Servers" 設定

3. **編輯 settings.json**
   - 點擊 "Edit in settings.json"
   - 加入 MCP Server 設定

### 方法 2: 直接編輯 settings.json

1. **開啟 settings.json**
   - 按 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
   - 輸入 "Preferences: Open Settings (JSON)"
   - 選擇並開啟

2. 在 VS Code 的 `settings.json` 中加入：

   **方式 1: 使用 npx + tsx (推薦，不需要預先建置)**
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

   **方式 2: 使用預先建置的 JS (需要先執行 npm run build)**
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

   ⚠️ **重要**: 請將路徑改為您的實際專案路徑！

3. **儲存檔案**
   - `Cmd+S` (macOS) 或 `Ctrl+S` (Windows/Linux)

### 方法 3: 使用工作區設定

如果只想在這個專案中使用，可以建立工作區設定：

1. 在專案根目錄建立 `.vscode/settings.json`：
   ```bash
   mkdir -p .vscode
   ```

2. 編輯 `.vscode/settings.json`：

   **方式 1: 使用 npx + tsx (推薦)**
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
   
   ✨ **優點**: 
   - 不需要預先執行 `npm run build`
   - 修改程式碼後自動重新載入
   - 直接執行 TypeScript 原始碼

   **方式 2: 使用預先建置的 JS**
   ```json
   {
     "mcp.servers": {
       "todo": {
         "command": "node",
         "args": [
           "${workspaceFolder}/mcp-server/build/index.js"
         ],
         "env": {
           "TODO_API_URL": "http://localhost:3000"
         }
       }
     }
   }
   ```
   
   ✨ **優點**: 
   - 啟動速度較快
   - 生產環境推薦使用

   使用 `${workspaceFolder}` 可以避免寫死路徑，更具可移植性。

## 啟用 MCP Server

1. **重新載入 VS Code**
   - `Cmd+Shift+P` → 輸入 "Reload Window"
   - 或完全關閉並重新開啟 VS Code

2. **檢查 MCP 狀態**
   - 在 VS Code 狀態列查看 MCP 圖示
   - 應該會顯示 "todo" 服務已連接

3. **開啟 MCP 面板**
   - `Cmd+Shift+P` → 輸入 "MCP: Show Panel"
   - 或點擊狀態列的 MCP 圖示

## 使用方式

### 與 GitHub Copilot Chat 整合

在 Copilot Chat 中，MCP Server 的功能會自動可用：

```
@workspace 請列出所有未完成的待辦事項
```

```
@workspace 幫我建立一個待辦事項：明天下午2點開會
```

```
@workspace 使用 daily_summary prompt 產生今日報告
```

### 直接使用 MCP 面板

1. 開啟 MCP 面板（`Cmd+Shift+P` → "MCP: Show Panel"）
2. 選擇 "todo" 服務
3. 可以看到：
   - **Tools**: 7 個可用工具
   - **Resources**: 2 個資源
   - **Prompts**: 6 個提示模板

4. 點擊任何工具或資源即可使用

## npx vs node：如何選擇？

### 使用 npx + tsx (推薦開發時使用)

**優點**:
- ✅ 不需要預先建置 (`npm run build`)
- ✅ 修改程式碼後自動生效
- ✅ 開發體驗更好
- ✅ 可以直接執行 TypeScript

**缺點**:
- ❌ 首次啟動稍慢（需要下載 tsx）
- ❌ 執行時稍微佔用更多記憶體

**設定範例**:
```json
{
  "command": "npx",
  "args": ["-y", "--prefix", "${workspaceFolder}/mcp-server", "tsx", "${workspaceFolder}/mcp-server/src/index.ts"]
}
```

### 使用 node (推薦生產環境)

**優點**:
- ✅ 啟動速度快
- ✅ 記憶體使用較少
- ✅ 穩定可靠

**缺點**:
- ❌ 需要預先建置
- ❌ 修改程式碼後需要重新建置

**設定範例**:
```json
{
  "command": "node",
  "args": ["${workspaceFolder}/mcp-server/build/index.js"]
}
```

### 建議

- **開發時**: 使用 `npx tsx` 方式，可以即時看到修改效果
- **生產環境**: 使用 `node` 方式，效能更好
- **團隊協作**: 在 `.vscode/settings.json.example` 中使用 `npx` 方式，讓新成員更容易上手

## 設定選項

### 環境變數

您可以在設定中加入更多環境變數：

```json
{
  "mcp.servers": {
    "todo": {
      "command": "node",
      "args": ["${workspaceFolder}/mcp-server/build/index.js"],
      "env": {
        "TODO_API_URL": "http://localhost:3000",
        "TODO_API_TIMEOUT": "10000",
        "NODE_ENV": "development"
      }
    }
  }
}
```

### 使用不同的 Port

如果 API 運行在不同的 port：

```json
{
  "env": {
    "TODO_API_URL": "http://localhost:3001"
  }
}
```

### 開發模式

開發時可以啟用詳細日誌：

```json
{
  "env": {
    "DEBUG": "*",
    "NODE_ENV": "development"
  }
}
```

## 測試設定

### 1. 檢查連線狀態

開啟 VS Code 的輸出面板：
- `View` → `Output`
- 選擇 "Model Context Protocol"
- 應該會看到連接成功的訊息

### 2. 測試 Tools

在 MCP 面板中：
1. 展開 "Tools"
2. 點擊 "list_todos"
3. 輸入參數（可選）
4. 點擊 "Execute"

### 3. 測試 Resources

1. 展開 "Resources"
2. 點擊 "todo://stats"
3. 查看統計資訊

### 4. 測試 Prompts

1. 展開 "Prompts"
2. 點擊 "daily_summary"
3. 執行並查看結果

## 疑難排解

### MCP 擴充功能找不到

確認：
- VS Code 版本是否為最新
- 擴充功能市場是否可訪問
- 嘗試手動搜尋 "Model Context Protocol"

### Server 無法啟動

檢查：
1. **路徑是否正確**
   ```bash
   # 測試路徑
   node /Users/austin/Documents/sideProject/express-to-do-api/mcp-server/build/index.js
   ```

2. **Node.js 是否在 PATH 中**
   ```bash
   which node
   node --version
   ```

3. **是否已建置**
   ```bash
   ls mcp-server/build/index.js
   ```

4. **API 是否運行**
   ```bash
   curl http://localhost:3000/
   ```

### 看不到 MCP 圖示

1. 重新載入視窗：`Cmd+Shift+P` → "Reload Window"
2. 檢查擴充功能是否啟用
3. 查看輸出面板的錯誤訊息

### Tools 執行失敗

1. **檢查 API 連線**
   ```bash
   curl http://localhost:3000/todos
   ```

2. **查看詳細錯誤**
   - 開啟 "Output" → "Model Context Protocol"
   - 查看錯誤訊息

3. **檢查參數格式**
   - 確認 JSON 格式正確
   - 必填參數是否都有提供

## 高級設定

### 多個 MCP Servers

您可以同時設定多個 MCP servers：

```json
{
  "mcp.servers": {
    "todo": {
      "command": "node",
      "args": ["${workspaceFolder}/mcp-server/build/index.js"],
      "env": {
        "TODO_API_URL": "http://localhost:3000"
      }
    },
    "another-service": {
      "command": "node",
      "args": ["/path/to/another/server.js"]
    }
  }
}
```

### 條件啟用

只在特定工作區啟用：

```json
{
  "mcp.servers": {
    "todo": {
      "command": "node",
      "args": ["${workspaceFolder}/mcp-server/build/index.js"],
      "enabled": true,
      "env": {
        "TODO_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

### 自動重啟

當檔案變更時自動重啟（開發時使用）：

```json
{
  "mcp.servers": {
    "todo": {
      "command": "node",
      "args": ["${workspaceFolder}/mcp-server/build/index.js"],
      "watch": [
        "${workspaceFolder}/mcp-server/build/**/*.js"
      ]
    }
  }
}
```

## 鍵盤快捷鍵

建議設定一些快捷鍵方便使用：

1. 開啟 `Keyboard Shortcuts` (`Cmd+K Cmd+S`)
2. 搜尋 "MCP"
3. 設定您喜歡的快捷鍵：
   - `MCP: Show Panel`
   - `MCP: Refresh Servers`
   - `MCP: Toggle Server`

## 最佳實踐

### 1. 使用工作區設定
將 MCP 設定放在 `.vscode/settings.json`，方便團隊協作。

### 2. 使用相對路徑
使用 `${workspaceFolder}` 而不是絕對路徑。

### 3. 環境變數分離
敏感資訊放在 `.env` 檔案，不要提交到版本控制。

### 4. 定期更新
保持 MCP 擴充功能和 SDK 在最新版本。

## 參考資源

- [VS Code MCP 擴充功能文件](https://marketplace.visualstudio.com/items?itemName=modelcontextprotocol.mcp)
- [MCP 官方文件](https://modelcontextprotocol.io)
- [VS Code Settings 文件](https://code.visualstudio.com/docs/getstarted/settings)

## 回饋與支援

如遇到問題：
1. 查看輸出面板的錯誤訊息
2. 檢查 `TESTING.md` 中的測試步驟
3. 查看主專案 README 的疑難排解章節

---

**提示**: 設定完成後，記得重新載入 VS Code 視窗以套用變更！
