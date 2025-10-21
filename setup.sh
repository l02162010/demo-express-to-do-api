#!/bin/bash

# 快速啟動腳本 - 同時啟動 API 和 MCP Server

echo "🚀 啟動 Express TODO API 和 MCP Server"
echo "========================================="
echo ""

# 檢查是否已安裝依賴
if [ ! -d "node_modules" ]; then
    echo "📦 安裝 API 依賴..."
    npm install
fi

if [ ! -d "mcp-server/node_modules" ]; then
    echo "📦 安裝 MCP Server 依賴..."
    cd mcp-server && npm install && cd ..
fi

# 檢查是否已建置 MCP Server
if [ ! -d "mcp-server/build" ]; then
    echo "🔨 建置 MCP Server..."
    cd mcp-server && npm run build && cd ..
fi

echo ""
echo "✅ 準備完成！"
echo ""
echo "請在兩個不同的終端視窗執行以下命令："
echo ""
echo "終端 1 (API Server):"
echo "  npm run dev"
echo ""
echo "終端 2 (MCP Server):"
echo "  cd mcp-server && npm start"
echo ""
echo "或者將 MCP Server 設定到 Claude Desktop："
echo "  參考 README.md 中的設定說明"
echo ""
