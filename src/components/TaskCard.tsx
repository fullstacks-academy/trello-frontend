import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../lib/apiClient";
import { Trash2, Edit3, Check } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { IconButton } from "../ui/IconButton";

interface Props {
  task: Task;
  onUpdate?: (params: { taskId: string; updates: Partial<Task> }) => void;
  onDelete?: (taskId: string) => void;
  isOverlay?: boolean;
}

export function TaskCard({ task, onUpdate, onDelete, isOverlay }: Props) {
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
      onUpdate?.({ taskId: task.id, updates: { title: title.trim() } });
      setIsEditing(false);
    }
  };

  const handleDescriptionSave = () => {
    onUpdate?.({
      taskId: task.id,
      updates: { description: description.trim() },
    });
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDescriptionSave();
    } else if (e.key === "Escape") {
      setDescription(task.description || "");
      setIsEditing(false);
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      setTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleConfirm = () => {
    handleTitleSave();
    handleDescriptionSave();
  };

  if (isOverlay) {
    return (
      <Card className="w-72">
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-gray-600">{task.description}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={handleTitleKeyPress}
                  className="text-sm"
                  autoFocus
                />
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={handleDescriptionKeyDown}
                  placeholder="Add a description..."
                  className="text-sm resize-none"
                  rows={2}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <h4
                  className="font-medium text-gray-900 text-sm cursor-pointer hover:bg-gray-50 py-1 px-2 rounded"
                  onClick={() => setIsEditing(true)}
                >
                  {task.title}
                </h4>
                {task.description && (
                  <p
                    className="text-sm text-gray-600 cursor-pointer hover:bg-gray-50 py-1 px-2 rounded"
                    onClick={() => setIsEditing(true)}
                  >
                    {task.description}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isEditing ? (
              <IconButton
                variant="c2a"
                onClick={handleConfirm}
                title="Confirm changes"
              >
                <Check size={12} />
              </IconButton>
            ) : (
              <IconButton onClick={() => setIsEditing(true)} title="Edit card">
                <Edit3 size={12} />
              </IconButton>
            )}
            <IconButton
              variant="destructive"
              onClick={() => onDelete?.(task.id)}
              title="Delete card"
            >
              <Trash2 size={12} />
            </IconButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
