import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Column as ColumnType, Task } from "../store/atoms";
import { useBoardState } from "../store/useBoardState";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { IconButton } from "../ui/IconButton";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
}

export function Column({ column, tasks }: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const { setNodeRef } = useDroppable({ id: column.id });
  const { updateTask, deleteTask, addTask, deleteColumn } = useBoardState();

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
    <div className="flex-shrink-0 w-80 flex h-full flex-col">
      <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col justify-between gap-4">
        <div className="flex-0 flex flex-row justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color }}
            />
            {isEditing ? (
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleKeyPress}
                className="font-semibold text-gray-900"
                autoFocus
              />
            ) : (
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
            )}
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <IconButton onClick={() => setIsEditing(true)} title="Edit column">
              <Edit3 size={14} />
            </IconButton>
            <IconButton
              variant="destructive"
              onClick={() => deleteColumn(column.id)}
              title="Delete column"
            >
              <Trash2 size={14} />
            </IconButton>
          </div>
        </div>

        <div ref={setNodeRef} className="flex-1 bg-gray-100 rounded-lg p-2">
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={(params) => updateTask(params)}
                  onDelete={(taskId) => deleteTask(taskId)}
                />
              ))}
            </div>
          </SortableContext>

          <Button
            variant="ghost"
            onClick={() => addTask(column.id)}
            className="w-full mt-3 text-gray-500 hover:text-gray-700 hover:bg-gray-200"
          >
            <Plus size={16} className="mr-2" />
            Add a card
          </Button>
        </div>
      </div>
    </div>
  );
}
