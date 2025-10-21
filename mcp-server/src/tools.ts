/**
 * MCP Tools implementation for TODO API
 */
import { TodoApiClient } from './client.js';

export function createTools(client: TodoApiClient) {
  return {
    /**
     * Tool 1: list_todos
     * 取得待辦事項列表
     */
    list_todos: {
      description: '取得待辦事項列表，支援過濾、搜尋和分頁功能',
      inputSchema: {
        type: 'object',
        properties: {
          completed: {
            type: 'boolean',
            description: '過濾完成狀態：true 只顯示已完成，false 只顯示未完成，不提供則顯示全部'
          },
          search: {
            type: 'string',
            description: '搜尋關鍵字，會在標題和描述中搜尋'
          },
          limit: {
            type: 'number',
            description: '每頁顯示數量，預設 50，最大 200',
            default: 50
          },
          offset: {
            type: 'number',
            description: '偏移量，用於分頁',
            default: 0
          }
        }
      },
      handler: async (args: any) => {
        const result = await client.listTodos({
          completed: args.completed,
          search: args.search,
          limit: args.limit,
          offset: args.offset
        });
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }
    },

    /**
     * Tool 2: get_todo
     * 取得單一待辦事項
     */
    get_todo: {
      description: '根據 ID 取得單一待辦事項的完整資訊',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '待辦事項的唯一識別碼 (UUID)'
          }
        },
        required: ['id']
      },
      handler: async (args: any) => {
        const todo = await client.getTodo(args.id);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(todo, null, 2)
            }
          ]
        };
      }
    },

    /**
     * Tool 3: create_todo
     * 建立新待辦事項
     */
    create_todo: {
      description: '建立一個新的待辦事項',
      inputSchema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: '待辦事項的標題（必填）'
          },
          description: {
            type: 'string',
            description: '待辦事項的詳細描述（選填）'
          },
          completed: {
            type: 'boolean',
            description: '是否已完成，預設為 false',
            default: false
          },
          dueDate: {
            type: 'string',
            description: '截止日期，ISO 8601 格式（例如：2025-10-25T09:00:00.000Z）'
          }
        },
        required: ['title']
      },
      handler: async (args: any) => {
        const todo = await client.createTodo({
          title: args.title,
          description: args.description,
          completed: args.completed,
          dueDate: args.dueDate
        });
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ 成功建立待辦事項\n\n${JSON.stringify(todo, null, 2)}`
            }
          ]
        };
      }
    },

    /**
     * Tool 4: update_todo
     * 更新待辦事項（局部更新）
     */
    update_todo: {
      description: '更新待辦事項的部分欄位，只需提供要更新的欄位',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '待辦事項的唯一識別碼 (UUID)'
          },
          title: {
            type: 'string',
            description: '新的標題'
          },
          description: {
            type: 'string',
            description: '新的描述'
          },
          completed: {
            type: 'boolean',
            description: '更新完成狀態'
          },
          dueDate: {
            type: ['string', 'null'],
            description: '新的截止日期（ISO 8601 格式）或 null 表示移除截止日期'
          }
        },
        required: ['id']
      },
      handler: async (args: any) => {
        const { id, ...updateParams } = args;
        const todo = await client.updateTodo(id, updateParams);
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ 成功更新待辦事項\n\n${JSON.stringify(todo, null, 2)}`
            }
          ]
        };
      }
    },

    /**
     * Tool 5: delete_todo
     * 刪除待辦事項
     */
    delete_todo: {
      description: '刪除指定的待辦事項',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '待辦事項的唯一識別碼 (UUID)'
          }
        },
        required: ['id']
      },
      handler: async (args: any) => {
        const result = await client.deleteTodo(args.id);
        
        return {
          content: [
            {
              type: 'text',
              text: `🗑️ 成功刪除待辦事項\n\n${JSON.stringify(result.deleted, null, 2)}`
            }
          ]
        };
      }
    },

    /**
     * Tool 6: mark_todo_completed
     * 標記待辦事項為已完成
     */
    mark_todo_completed: {
      description: '快速標記待辦事項為已完成',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '待辦事項的唯一識別碼 (UUID)'
          }
        },
        required: ['id']
      },
      handler: async (args: any) => {
        const todo = await client.markAsCompleted(args.id);
        
        return {
          content: [
            {
              type: 'text',
              text: `✅ 已標記為完成\n\n${JSON.stringify(todo, null, 2)}`
            }
          ]
        };
      }
    },

    /**
     * Tool 7: mark_todo_incomplete
     * 標記待辦事項為未完成
     */
    mark_todo_incomplete: {
      description: '快速標記待辦事項為未完成',
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: '待辦事項的唯一識別碼 (UUID)'
          }
        },
        required: ['id']
      },
      handler: async (args: any) => {
        const todo = await client.markAsIncomplete(args.id);
        
        return {
          content: [
            {
              type: 'text',
              text: `⭕ 已標記為未完成\n\n${JSON.stringify(todo, null, 2)}`
            }
          ]
        };
      }
    }
  };
}
