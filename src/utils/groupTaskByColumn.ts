import type { Task } from "../lib/apiClient";

export const groupTasksByColumn = (tasks: Task[]) =>
  Object.groupBy(tasks, (t) => t.column_id);
