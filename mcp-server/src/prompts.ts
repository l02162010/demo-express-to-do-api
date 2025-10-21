/**
 * MCP Prompts implementation for TODO API
 */

export function createPrompts() {
  return {
    /**
     * Prompt 1: daily_summary
     * 每日待辦事項總結
     */
    daily_summary: {
      name: 'daily_summary',
      description: '產生今日待辦事項的完整報告，包含完成進度和到期提醒',
      arguments: [],
      handler: async () => {
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `請使用 list_todos 工具取得所有待辦事項，然後：

1. 統計總數、已完成數、未完成數
2. 列出今天到期的項目（dueDate 為今天）
3. 列出已逾期但未完成的項目
4. 按優先級建議今天應該完成的任務

請以易讀的格式呈現報告，使用適當的表情符號和格式化。`
              }
            }
          ]
        };
      }
    },

    /**
     * Prompt 2: weekly_plan
     * 本週工作計劃
     */
    weekly_plan: {
      name: 'weekly_plan',
      description: '規劃並組織本週的待辦事項',
      arguments: [],
      handler: async () => {
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `請使用 list_todos 工具取得所有未完成的待辦事項，然後：

1. 列出本週到期的項目（dueDate 在本週內）
2. 識別沒有截止日期但重要的項目
3. 建議每天的工作分配
4. 標示可能需要延期的項目

請製作一個本週工作計劃表，按日期組織，使用清晰的格式。`
              }
            }
          ]
        };
      }
    },

    /**
     * Prompt 3: overdue_tasks
     * 逾期任務提醒
     */
    overdue_tasks: {
      name: 'overdue_tasks',
      description: '列出所有已逾期的待辦事項並建議處理順序',
      arguments: [],
      handler: async () => {
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `請使用 list_todos 工具取得所有待辦事項，然後：

1. 篩選出所有 dueDate 早於今天且 completed 為 false 的項目
2. 按逾期天數排序（最久的在前）
3. 評估每個任務的緊急程度
4. 建議處理優先順序和可能的行動方案

請提供逾期任務報告和建議，使用警告符號標示緊急項目。`
              }
            }
          ]
        };
      }
    },

    /**
     * Prompt 4: quick_add
     * 智能快速新增任務
     */
    quick_add: {
      name: 'quick_add',
      description: '用自然語言快速新增待辦事項，自動解析標題、描述和截止日期',
      arguments: [
        {
          name: 'task_description',
          description: '任務的自然語言描述',
          required: true
        }
      ],
      handler: async (args: { task_description: string }) => {
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `根據使用者提供的任務描述：「${args.task_description}」

請分析這段描述並：
1. 提取出簡潔的任務標題（10-50 字）
2. 提取出詳細描述（如果有）
3. 識別是否包含日期或時間資訊，轉換為 ISO 格式的 dueDate
   - 例如："明天"、"下週一"、"10月25日" 等
   - 今天是 ${new Date().toISOString().split('T')[0]}
4. 判斷是否為緊急任務

然後使用 create_todo 工具建立這個待辦事項，並向使用者確認已建立的內容。`
              }
            }
          ]
        };
      }
    },

    /**
     * Prompt 5: completion_report
     * 完成度分析報告
     */
    completion_report: {
      name: 'completion_report',
      description: '分析待辦事項的完成情況並提供統計圖表',
      arguments: [],
      handler: async () => {
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `請使用 list_todos 工具取得所有待辦事項，然後：

1. 計算整體完成率（已完成 / 總數）
2. 分析本週完成的任務數量
3. 統計平均完成時間（從 createdAt 到標記完成的時間）
4. 列出最近完成的 5 個任務
5. 提供生產力建議

請製作一份包含數據和視覺化建議的完成度報告，使用圖表形式呈現數據。`
              }
            }
          ]
        };
      }
    },

    /**
     * Prompt 6: clean_completed
     * 清理已完成任務
     */
    clean_completed: {
      name: 'clean_completed',
      description: '批次刪除已完成的舊任務以保持列表整潔',
      arguments: [
        {
          name: 'days_old',
          description: '刪除幾天前完成的任務（預設 30 天）',
          required: false
        }
      ],
      handler: async (args: { days_old?: number }) => {
        const daysOld = args.days_old || 30;
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `請使用 list_todos 工具取得所有已完成的待辦事項（completed = true），然後：

1. 篩選出 updatedAt 早於 ${daysOld} 天前的項目
2. 列出這些項目並向使用者確認是否要刪除
3. ⚠️ 重要：等待使用者明確確認後，才使用 delete_todo 工具逐一刪除
4. 報告刪除的數量

請謹慎處理並在刪除前務必請求確認。列出將被刪除的項目清單，並詢問使用者是否確定要刪除。`
              }
            }
          ]
        };
      }
    }
  };
}
