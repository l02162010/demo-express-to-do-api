/**
 * Type definitions for TODO API MCP Server
 */

/**
 * TODO 項目的完整資料結構
 */
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * API 回應 - 取得列表
 */
export interface TodoListResponse {
  total: number;
  limit: number;
  offset: number;
  items: Todo[];
}

/**
 * 建立 TODO 的參數
 */
export interface CreateTodoParams {
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
}

/**
 * 更新 TODO 的參數（局部更新）
 */
export interface UpdateTodoParams {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string | null;
}

/**
 * 列表查詢參數
 */
export interface ListTodosParams {
  completed?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

/**
 * TODO 統計資訊
 */
export interface TodoStats {
  total: number;
  completed: number;
  incomplete: number;
  dueTodayCount: number;
  overdueCount: number;
  noDueDateCount: number;
}

/**
 * API 錯誤回應
 */
export interface ApiErrorResponse {
  error: string;
}

/**
 * 環境設定
 */
export interface ServerConfig {
  todoApiUrl: string;
  todoApiTimeout: number;
}
