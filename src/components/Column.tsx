import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import type { Column as ColumnType, Task } from "../lib/apiClient";

import {
  useCreateTask,
  useDeleteColumn,
  useDeleteTask,
  useUpdateTask,
} from "../lib/useBoard";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { Input } from "../ui/Input";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
}

export function Column({ column, tasks }: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const { setNodeRef } = useDroppable({ id: column.id });
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const deleteColumnMutation = useDeleteColumn();

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
            {isEditing ? (
              <Input
                className="font-semibold text-gray-900"
                type="text"
                value={title}
                autoFocus
                onBlur={handleTitleSave}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            ) : (
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
            )}
            <Badge className="text-xs" variant="secondary">
              {tasks.length}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <IconButton title="Edit column" onClick={() => setIsEditing(true)}>
              <Edit3 size={14} />
            </IconButton>
            <IconButton
              title="Delete column"
              variant="destructive"
              onClick={() => deleteColumnMutation.mutate({ id: column.id })}
            >
              <Trash2 size={14} />
            </IconButton>
          </div>
        </div>

        <div
          className="flex-1 bg-gray-100 rounded-lg p-2 flex flex-col gap-3"
          ref={setNodeRef}
        >
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={(taskId) =>
                    deleteTaskMutation.mutate({ id: taskId })
                  }
                  onUpdate={(params) => {
                    const currentTask = tasks.find((t) => t.id === params.id);
                    if (currentTask) {
                      updateTaskMutation.mutate({
                        id: params.id,
                        title: params.title || currentTask.title,
                        description:
                          params.description || currentTask.description || "",
                      });
                    }
                  }}
                />
              ))}
            </div>
          </SortableContext>

          <Button
            variant="ghost"
            onClick={() => {
              const newTaskId = `task-${Date.now()}`;
              createTaskMutation.mutate({
                id: newTaskId,
                title: "New Task",
                description: "Add description here",
                columnId: column.id,
              });
            }}
          >
            <Plus size={16} className="mr-2" />
            Add a card
          </Button>
        </div>
      </div>
    </div>
  );
}
