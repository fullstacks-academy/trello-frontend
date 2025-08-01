import {
  type DragOverEvent,
  type DragStartEvent,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Card } from "./Card";
import { Column } from "./Column";
import { NewColumn } from "./NewColumn";

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

export function Board() {
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [activeTask, setActiveTask] = useState<Task | undefined>(undefined);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = tasks.find((task) => task.id === activeId);
    const isOverTask = tasks.find((task) => task.id === overId);

    if (!isActiveTask) return;

    if (isOverTask) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((t) => t.id === activeId);
        const newIndex = tasks.findIndex((t) => t.id === overId);

        return arrayMove(tasks, oldIndex, newIndex);
      });
    } else {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const newTasks = [...tasks];
        newTasks[activeIndex] = {
          ...newTasks[activeIndex],
          columnId: overId as string,
        };
        return newTasks;
      });
    }
  };

  const handleDragEnd = () => {
    setActiveTask(undefined);
  };

  const addTask = (columnId: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: "New Task",
      description: "Add description here",
      columnId,
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const addColumn = (title: string) => {
    if (!title.trim()) return;

    const newColumn: Column = {
      id: Date.now().toString(),
      title,
      color: "#6b7280",
    };
    setColumns([...columns, newColumn]);
  };

  const deleteColumn = (columnId: string) => {
    setColumns(columns.filter((col) => col.id !== columnId));
    setTasks(tasks.filter((task) => task.columnId !== columnId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4">
      <div className="max-w-7xl w-full flex-1 mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Board</h1>
          <p className="text-gray-600">
            Organize your tasks with drag and drop
          </p>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-1 gap-4 overflow-x-auto">
            <SortableContext items={columns.map((col) => col.id)}>
              {columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                  onAddTask={addTask}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onDeleteColumn={deleteColumn}
                />
              ))}
            </SortableContext>
            <NewColumn onAddColumn={addColumn} />
          </div>

          {createPortal(
            <DragOverlay>
              {activeTask ? <Card task={activeTask} isOverlay /> : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </div>
  );
}
