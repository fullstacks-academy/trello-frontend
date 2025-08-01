import { useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Card } from "./Card";
import type { Task, Column as ColumnType } from "./Board";
import { Plus, Trash2, Edit3 } from "lucide-react";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
  onDeleteColumn?: (columnId: string) => void;
}

export function Column({
  column,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onDeleteColumn,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const handleTitleSave = () => {
    if (title.trim()) {
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      setTitle(column.title);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex-shrink-0 w-80 flex flex-col">
      <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: column.color }}
              />
              {isEditing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={handleKeyPress}
                  className="font-semibold text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
              )}
              <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                {tasks.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                title="Edit column"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => onDeleteColumn?.(column.id)}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete column"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div ref={setNodeRef} className="flex-1 bg-gray-100 rounded-lg p-2">
            <SortableContext
              items={tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {tasks.map((task) => (
                  <Card
                    key={task.id}
                    task={task}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        </div>

        <button
          onClick={() => onAddTask(column.id)}
          className="w-full mt-3 p-2 cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add a card
        </button>
      </div>
    </div>
  );
}
