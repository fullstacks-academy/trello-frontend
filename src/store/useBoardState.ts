import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  columnsAtom,
  tasksAtom,
  activeTaskAtom,
  tasksByColumnAtom,
  addTaskAtom,
  updateTaskAtom,
  deleteTaskAtom,
  addColumnAtom,
  deleteColumnAtom,
  moveTaskAtom,
  reorderTasksAtom,
  type Task,
  type Column,
} from "./atoms";

export function useBoardState() {
  const columns = useAtomValue(columnsAtom);
  const tasks = useAtomValue(tasksAtom);
  const [activeTask, setActiveTask] = useAtom(activeTaskAtom);
  const tasksByColumn = useAtomValue(tasksByColumnAtom);

  const addTask = useSetAtom(addTaskAtom);
  const updateTask = useSetAtom(updateTaskAtom);
  const deleteTask = useSetAtom(deleteTaskAtom);
  const addColumn = useSetAtom(addColumnAtom);
  const deleteColumn = useSetAtom(deleteColumnAtom);
  const moveTask = useSetAtom(moveTaskAtom);
  const reorderTasks = useSetAtom(reorderTasksAtom);

  return {
    // State
    columns,
    tasks,
    activeTask,
    tasksByColumn,

    // Actions
    addTask,
    updateTask,
    deleteTask,
    addColumn,
    deleteColumn,
    moveTask,
    reorderTasks,
    setActiveTask,
  };
}

// Type exports for convenience
export type { Task, Column };
