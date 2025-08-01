import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column } from "./Column";
import type { Column as ColumnType, Task } from "../lib/apiClient";

interface SortableColumnProps {
  column: ColumnType;
  tasks: Task[];
}

export function SortableColumn({ column, tasks }: SortableColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab flex flex-col active:cursor-grabbing"
    >
      <Column column={column} tasks={tasks} />
    </div>
  );
}
