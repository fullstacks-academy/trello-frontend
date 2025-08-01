import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "./Board";
import { Trash2, Edit3 } from "lucide-react";

interface CardProps {
  task: Task;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
  isOverlay?: boolean;
}

export function Card({
  task,
  onUpdate,
  onDelete,
  isOverlay = false,
}: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTitleSave = () => {
    if (title.trim()) {
      onUpdate?.(task.id, { title: title.trim() });
      setIsEditing(false);
    }
  };

  const handleDescriptionSave = () => {
    onUpdate?.(task.id, { description: description.trim() });
  };

  const handleKeyPress = (e: React.KeyboardEvent, isTitle: boolean) => {
    if (e.key === "Enter") {
      if (isTitle) {
        handleTitleSave();
      } else {
        handleDescriptionSave();
      }
    } else if (e.key === "Escape") {
      if (isTitle) {
        setTitle(task.title);
      } else {
        setDescription(task.description || "");
      }
      setIsEditing(false);
    }
  };

  if (isOverlay) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 w-72 border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
        {task.description && (
          <p className="text-sm text-gray-600">{task.description}</p>
        )}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => handleKeyPress(e, true)}
                className="w-full font-medium text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                autoFocus
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionSave}
                onKeyDown={(e) => handleKeyPress(e, false)}
                placeholder="Add a description..."
                className="w-full text-sm text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <h4
                className="font-medium text-gray-900 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                onClick={() => setIsEditing(true)}
              >
                {task.title}
              </h4>
              {task.description && (
                <p
                  className="text-sm text-gray-600 cursor-pointer hover:bg-gray-50 p-1 rounded"
                  onClick={() => setIsEditing(true)}
                >
                  {task.description}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Edit card"
          >
            <Edit3 size={12} />
          </button>
          <button
            onClick={() => onDelete?.(task.id)}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete card"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
