import { atom } from "jotai";

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
  color: string;
}

const defaultColumns: Column[] = [
  { id: "todo", title: "To Do", color: "#3b82f6" },
  { id: "in-progress", title: "In Progress", color: "#f59e0b" },
  { id: "done", title: "Done", color: "#10b981" },
];

const defaultTasks: Task[] = [
  {
    id: "1",
    title: "Learn React",
    description: "Study React fundamentals and hooks",
    columnId: "todo",
  },
  {
    id: "2",
    title: "Build a project",
    description: "Create a real-world application",
    columnId: "in-progress",
  },
  {
    id: "3",
    title: "Deploy to production",
    description: "Set up CI/CD pipeline",
    columnId: "done",
  },
];

export const columnsAtom = atom<Column[]>(defaultColumns);
export const tasksAtom = atom<Task[]>(defaultTasks);
export const activeTaskAtom = atom<Task | undefined>(undefined);

export const tasksByColumnAtom = atom((get) => {
  const tasks = get(tasksAtom);
  const columns = get(columnsAtom);

  return columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter((task) => task.columnId === column.id);
    return acc;
  }, {} as Record<string, Task[]>);
});

export const addTaskAtom = atom(null, (get, set, columnId: string) => {
  const newTask: Task = {
    id: Date.now().toString(),
    title: "New Task",
    description: "Add description here",
    columnId,
  };
  set(tasksAtom, [...get(tasksAtom), newTask]);
});

export const updateTaskAtom = atom(
  null,
  (
    get,
    set,
    { taskId, updates }: { taskId: string; updates: Partial<Task> }
  ) => {
    const tasks = get(tasksAtom);
    set(
      tasksAtom,
      tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  }
);

export const deleteTaskAtom = atom(null, (get, set, taskId: string) => {
  const tasks = get(tasksAtom);
  set(
    tasksAtom,
    tasks.filter((task) => task.id !== taskId)
  );
});

export const addColumnAtom = atom(null, (get, set, title: string) => {
  if (!title.trim()) return;

  const newColumn: Column = {
    id: Date.now().toString(),
    title,
    color: "#6b7280",
  };
  set(columnsAtom, [...get(columnsAtom), newColumn]);
});

export const deleteColumnAtom = atom(null, (get, set, columnId: string) => {
  const columns = get(columnsAtom);
  const tasks = get(tasksAtom);

  set(
    columnsAtom,
    columns.filter((col) => col.id !== columnId)
  );
  set(
    tasksAtom,
    tasks.filter((task) => task.columnId !== columnId)
  );
});

export const moveTaskAtom = atom(
  null,
  (
    get,
    set,
    { taskId, newColumnId }: { taskId: string; newColumnId: string }
  ) => {
    const tasks = get(tasksAtom);
    set(
      tasksAtom,
      tasks.map((task) =>
        task.id === taskId ? { ...task, columnId: newColumnId } : task
      )
    );
  }
);

export const reorderTasksAtom = atom(
  null,
  (
    get,
    set,
    { oldIndex, newIndex }: { oldIndex: number; newIndex: number }
  ) => {
    const tasks = get(tasksAtom);
    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(oldIndex, 1);
    newTasks.splice(newIndex, 0, movedTask);
    set(tasksAtom, newTasks);
  }
);
