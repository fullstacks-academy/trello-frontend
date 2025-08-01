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
import { TaskCard } from "./TaskCard";
import { SortableColumn } from "./SortableColumn";
import { NewColumn } from "./NewColumn";
import { useBoardState } from "../store/useBoardState";

export function Board() {
  const {
    columns,
    tasks,
    activeTask,
    tasksByColumn,
    moveTask,
    reorderTasks,
    reorderColumns,
    setActiveTask,
  } = useBoardState();

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
    const isOverColumn = columns.find((col) => col.id === overId);

    // Only handle task dragging in onDragOver
    if (!isActiveTask) return;

    if (isOverTask) {
      const oldIndex = tasks.findIndex((t) => t.id === activeId);
      const newIndex = tasks.findIndex((t) => t.id === overId);
      reorderTasks({ oldIndex, newIndex });
    } else if (isOverColumn) {
      moveTask({ taskId: activeId as string, newColumnId: overId as string });
    }
  };

  const handleDragEnd = (event: DragOverEvent) => {
    const { active, over } = event;

    // Handle column reordering only in onDragEnd
    if (active && over && active.id !== over.id) {
      const isActiveColumn = columns.find((col) => col.id === active.id);
      const isOverColumn = columns.find((col) => col.id === over.id);

      if (isActiveColumn && isOverColumn) {
        const oldIndex = columns.findIndex((col) => col.id === active.id);
        const newIndex = columns.findIndex((col) => col.id === over.id);
        reorderColumns({ oldIndex, newIndex });
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
                  tasks={tasksByColumn[column.id]}
                />
              ))}
            </SortableContext>
            <NewColumn />
          </div>

          {createPortal(
            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </div>
  );
}
