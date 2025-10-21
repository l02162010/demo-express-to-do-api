#!/usr/bin/env node

/**
 * TODO API MCP Server
 * 
 * Model Context Protocol Server for Express TODO API
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import * as dotenv from 'dotenv';
import { TodoApiClient } from './client.js';
import { createTools } from './tools.js';
import { createResources } from './resources.js';
import { createPrompts } from './prompts.js';
import { ServerConfig } from './types.js';

// 載入環境變數
dotenv.config();

// 設定
const config: ServerConfig = {
  todoApiUrl: process.env.TODO_API_URL || 'http://localhost:3000',
  todoApiTimeout: parseInt(process.env.TODO_API_TIMEOUT || '5000', 10)
};

// 建立客戶端
const client = new TodoApiClient(config);

// 建立 Tools、Resources 和 Prompts
const tools = createTools(client);
const resources = createResources(client);
const prompts = createPrompts();

// 建立 MCP Server
const server = new Server(
  {
    name: 'todo-mcp-server',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {}
    }
  }
);

/**
 * Handler: List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.entries(tools).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: tool.inputSchema
    }))
  };
});

/**
 * Handler: Call a tool
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const tool = tools[toolName as keyof typeof tools];

  if (!tool) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  try {
    return await tool.handler(request.params.arguments || {});
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `❌ 錯誤：${errorMessage}`
        }
      ],
      isError: true
    };
  }
});

/**
 * Handler: List available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: Object.entries(resources).map(([uri, resource]) => ({
      uri,
      name: uri,
      description: resource.description,
      mimeType: resource.mimeType
    }))
  };
});

/**
 * Handler: Read a resource
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const resource = resources[uri as keyof typeof resources];

  if (!resource) {
    throw new Error(`Unknown resource: ${uri}`);
  }

  try {
    return await resource.handler();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read resource: ${errorMessage}`);
  }
});

/**
 * Handler: List available prompts
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: Object.entries(prompts).map(([key, prompt]) => ({
      name: prompt.name,
      description: prompt.description,
      arguments: prompt.arguments
    }))
  };
});

/**
 * Handler: Get a prompt
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const promptName = request.params.name;
  const prompt = prompts[promptName as keyof typeof prompts];

  if (!prompt) {
    throw new Error(`Unknown prompt: ${promptName}`);
  }

  try {
    return await prompt.handler(request.params.arguments as any || {});
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get prompt: ${errorMessage}`);
  }
});

/**
 * Start the server
 */
async function main() {
  // 測試 API 連線
  try {
    await client.healthCheck();
    console.error('✅ 成功連接到 TODO API');
  } catch (error) {
    console.error('⚠️  警告：無法連接到 TODO API');
    console.error('   請確認 API 伺服器正在運行於', config.todoApiUrl);
    console.error('   錯誤:', error instanceof Error ? error.message : String(error));
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('🚀 TODO MCP Server 已啟動');
  console.error('   API URL:', config.todoApiUrl);
  console.error('   工具數量:', Object.keys(tools).length);
  console.error('   資源數量:', Object.keys(resources).length);
  console.error('   提示數量:', Object.keys(prompts).length);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
