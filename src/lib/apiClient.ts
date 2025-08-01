import { HttpClient } from "./httpClient";

const API_BASE_URL = "http://localhost:8000/api";

export interface Column {
  id: string;
  title: string;
  order_index: number;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  column_id: string;
  order_index: number;
  created_at: string;
}

export interface BoardData {
  columns: Column[];
  tasks: Task[];
}

class ApiClient {
  private readonly client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  async getBoard() {
    return this.client.get<BoardData>("/board");
  }

  async getColumns() {
    return this.client.get<Column[]>("/columns");
  }

  async createColumn(id: string, title: string) {
    return this.client.post<Column>("/columns", { id, title });
  }

  async reorderColumns(columns: Column[]) {
    return this.client.put<{ success: boolean }>("/columns/reorder", {
      columns,
    });
  }

  async deleteColumn(id: string) {
    return this.client.delete<{ success: boolean }>(`/columns/${id}`);
  }

  async createTask(
    id: string,
    title: string,
    description: string,
    columnId: string
  ) {
    return this.client.post<Task>("/tasks", {
      id,
      title,
      description,
      columnId,
    });
  }

  async updateTask(id: string, title: string, description: string) {
    return this.client.put<Task>(`/tasks/${id}`, {
      title,
      description,
    });
  }

  async moveTask(taskId: string, newColumnId: string) {
    return this.client.put<{ success: boolean }>("/tasks/move", {
      taskId,
      newColumnId,
    });
  }

  async reorderTasks(tasks: Task[]) {
    return this.client.put<{ success: boolean }>("/tasks/reorder", {
      tasks,
    });
  }

  async deleteTask(id: string) {
    return this.client.delete<{ success: boolean }>(`/tasks/${id}`);
  }
}

export const apiClient = new ApiClient(new HttpClient(API_BASE_URL));
