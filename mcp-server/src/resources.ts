/**
 * MCP Resources implementation for TODO API
 */
import { TodoApiClient } from './client.js';
import { TodoStats } from './types.js';

export function createResources(client: TodoApiClient) {
  return {
    /**
     * Resource 1: todo://list
     * 所有待辦事項的即時列表
     */
    'todo://list': {
      description: '所有待辦事項的即時列表',
      mimeType: 'application/json',
      handler: async () => {
        const result = await client.listTodos({ limit: 200 });
        
        return {
          contents: [
            {
              uri: 'todo://list',
              mimeType: 'application/json',
              text: JSON.stringify(result.items, null, 2)
            }
          ]
        };
      }
    },

    /**
     * Resource 2: todo://stats
     * 待辦事項統計資訊
     */
    'todo://stats': {
      description: '待辦事項統計資訊，包含總數、完成數、未完成數、今日到期數等',
      mimeType: 'application/json',
      handler: async () => {
        const result = await client.listTodos({ limit: 200 });
        const todos = result.items;

        // 計算統計資訊
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);

        const stats: TodoStats = {
          total: todos.length,
          completed: todos.filter(t => t.completed).length,
          incomplete: todos.filter(t => !t.completed).length,
          dueTodayCount: todos.filter(t => {
            if (!t.dueDate) return false;
            const dueDate = new Date(t.dueDate);
            return dueDate >= todayStart && dueDate < todayEnd;
          }).length,
          overdueCount: todos.filter(t => {
            if (!t.dueDate || t.completed) return false;
            const dueDate = new Date(t.dueDate);
            return dueDate < todayStart;
          }).length,
          noDueDateCount: todos.filter(t => !t.dueDate).length
        };

        return {
          contents: [
            {
              uri: 'todo://stats',
              mimeType: 'application/json',
              text: JSON.stringify(stats, null, 2)
            }
          ]
        };
      }
    }
  };
}
