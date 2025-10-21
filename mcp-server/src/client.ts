/**
 * HTTP Client for TODO API
 */
import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  Todo,
  TodoListResponse,
  CreateTodoParams,
  UpdateTodoParams,
  ListTodosParams,
  ApiErrorResponse,
  ServerConfig
} from './types.js';

export class TodoApiClient {
  private client: AxiosInstance;

  constructor(config: ServerConfig) {
    this.client = axios.create({
      baseURL: config.todoApiUrl,
      timeout: config.todoApiTimeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * 處理 API 錯誤
   */
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data?.error) {
        throw new Error(axiosError.response.data.error);
      }
      if (axiosError.code === 'ECONNREFUSED') {
        throw new Error('無法連接到 TODO API。請確認 API 伺服器正在運行。');
      }
      throw new Error(axiosError.message);
    }
    throw error;
  }

  /**
   * 健康檢查
   */
  async healthCheck(): Promise<{ ok: boolean; service: string; version: string }> {
    try {
      const response = await this.client.get('/');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 取得待辦事項列表
   */
  async listTodos(params?: ListTodosParams): Promise<TodoListResponse> {
    try {
      const queryParams: Record<string, string | number> = {};
      
      if (params?.completed !== undefined) {
        queryParams.completed = params.completed.toString();
      }
      if (params?.search) {
        queryParams.q = params.search;
      }
      if (params?.limit !== undefined) {
        queryParams.limit = params.limit;
      }
      if (params?.offset !== undefined) {
        queryParams.offset = params.offset;
      }

      const response = await this.client.get<TodoListResponse>('/todos', {
        params: queryParams
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 取得單一待辦事項
   */
  async getTodo(id: string): Promise<Todo> {
    try {
      const response = await this.client.get<Todo>(`/todos/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 建立新待辦事項
   */
  async createTodo(params: CreateTodoParams): Promise<Todo> {
    try {
      const response = await this.client.post<Todo>('/todos', params);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 更新待辦事項（局部更新）
   */
  async updateTodo(id: string, params: UpdateTodoParams): Promise<Todo> {
    try {
      const response = await this.client.patch<Todo>(`/todos/${id}`, params);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 刪除待辦事項
   */
  async deleteTodo(id: string): Promise<{ deleted: Todo }> {
    try {
      const response = await this.client.delete<{ deleted: Todo }>(`/todos/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 標記為已完成
   */
  async markAsCompleted(id: string): Promise<Todo> {
    return this.updateTodo(id, { completed: true });
  }

  /**
   * 標記為未完成
   */
  async markAsIncomplete(id: string): Promise<Todo> {
    return this.updateTodo(id, { completed: false });
  }
}
