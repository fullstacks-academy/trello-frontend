import {
  type DragOverEvent,
  type DragStartEvent,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { SortableColumn } from "./SortableColumn";
import { NewColumn } from "./NewColumn";
import {
  useBoard,
  useMoveTask,
  useReorderTasks,
  useReorderColumns,
} from "../lib/useBoard";
import type { Task } from "../lib/apiClient";

export function Board() {
  const { data: boardData, isLoading, error } = useBoard();
  const moveTaskMutation = useMoveTask();
  const reorderTasksMutation = useReorderTasks();
  const reorderColumnsMutation = useReorderColumns();

  const [activeTask, setActiveTask] = useState<Task | undefined>(undefined);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading board</p>
          <p className="text-gray-600 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!boardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">No board data available</p>
        </div>
      </div>
    );
  }

  const { columns, tasks } = boardData;

  const tasksByColumn = tasks.reduce(
    (acc, task) => {
      if (!acc[task.column_id]) {
        acc[task.column_id] = [];
      }
      acc[task.column_id].push(task);
      return acc;
    },
    {} as Record<string, Task[]>,
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
    const isOverColumn = columns.find((col) => col.id === overId);

    if (!isActiveTask) return;

    if (isOverTask) {
      const oldTaskColumnId = isActiveTask.column_id;
      const newTaskColumnId = isOverTask.column_id;

      if (oldTaskColumnId === newTaskColumnId) {
        const columnTasks = tasks.filter(
          (task) => task.column_id === oldTaskColumnId,
        );
        const oldIndex = columnTasks.findIndex((task) => task.id === activeId);
        const newIndex = columnTasks.findIndex((task) => task.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedTasks = [...columnTasks];
          const [movedTask] = reorderedTasks.splice(oldIndex, 1);
          reorderedTasks.splice(newIndex, 0, movedTask);

          const updatedTasks = reorderedTasks.map((task, index) => ({
            ...task,
            order_index: index,
          }));

          reorderTasksMutation.mutate({ tasks: updatedTasks });
        }
      } else {
        moveTaskMutation.mutate({
          taskId: activeId as string,
          newColumnId: newTaskColumnId,
        });
      }
    } else if (isOverColumn) {
      moveTaskMutation.mutate({
        taskId: activeId as string,
        newColumnId: overId as string,
      });
    }
  };

  const handleDragEnd = (event: DragOverEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const isActiveColumn = columns.find((col) => col.id === active.id);
      const isOverColumn = columns.find((col) => col.id === over.id);

      if (isActiveColumn && isOverColumn) {
        const oldIndex = columns.findIndex((col) => col.id === active.id);
        const newIndex = columns.findIndex((col) => col.id === over.id);

        const newColumns = [...columns];
        const [movedColumn] = newColumns.splice(oldIndex, 1);
        newColumns.splice(newIndex, 0, movedColumn);

        reorderColumnsMutation.mutate({ columns: newColumns });
      }
    }

    setActiveTask(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4">
      <div className="max-w-[1500px] w-full flex-1 mx-auto flex flex-col gap-6">
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
          <div className="flex flex-1 gap-4 overflow-x-auto p-2">
            <SortableContext
              items={columns.map((col) => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {columns.map((column) => (
                <SortableColumn
                  key={column.id}
                  column={column}
                  tasks={tasksByColumn[column.id] || []}
                />
              ))}
            </SortableContext>
            <NewColumn />
          </div>

          {createPortal(
            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      </div>
    </div>
  );
}
