import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, Edit3, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import type { Task } from "../lib/apiClient";

import { Card, CardContent } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

interface Props {
  task: Task;
  onUpdate?: (a: { id: string; title: string; description: string }) => void;
  onDelete?: (taskId: string) => void;
  isOverlay?: boolean;
}

export function TaskCard({ task, onUpdate, onDelete, isOverlay }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const ref = useRef<HTMLInputElement>(null);

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

  const handleConfirm = () => {
    if (title.trim() === "") return;

    onUpdate?.({
      title: title.trim(),
      id: task.id,
      description: description.trim(),
    });
    setIsEditing(false);
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      setDescription(task.description || "");
      setIsEditing(false);
    }
  };

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      setTitle(task.title);
      setIsEditing(false);
    }
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
                  className="text-sm"
                  ref={ref}
                  type="text"
                  value={title}
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={handleTitleKeyPress}
                />
                <Textarea
                  className="text-sm resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={handleDescriptionKeyDown}
                  placeholder="Add a description..."
                  rows={2}
                />
              </div>
            ) : (
              <div className="space-y-2">
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
                <h4
                  className="font-medium text-gray-900 text-sm cursor-pointer hover:bg-gray-50 py-1 px-2 rounded"
                  onClick={() => {
                    setIsEditing(true);
                    setTimeout(() => {
                      ref.current?.setSelectionRange(0, 100);
                    }, 0);
                  }}
                >
                  {task.title}
                </h4>
                {task.description && (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
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
                title="Confirm changes"
                variant="c2a"
                onClick={handleConfirm}
              >
                <Check size={12} />
              </IconButton>
            ) : (
              <IconButton title="Edit card" onClick={() => setIsEditing(true)}>
                <Edit3 size={12} />
              </IconButton>
            )}
            <IconButton
              title="Delete card"
              variant="destructive"
              onClick={() => onDelete?.(task.id)}
            >
              <Trash2 size={12} />
            </IconButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
