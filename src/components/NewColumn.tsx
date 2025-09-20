import { PlusCircle } from "lucide-react";
import { useState } from "react";

import { useCreateColumn } from "../lib/useBoard";
import { Card, CardContent } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { Input } from "../ui/Input";

export const NewColumn = () => {
  const [title, setTitle] = useState("");
  const createColumnMutation = useCreateColumn();

  const createColumn = () => {
    if (title.trim()) {
      const newColumnId = `col-${Date.now()}`;
      createColumnMutation.mutate({ id: newColumnId, title: title.trim() });
      setTitle("");
    }
  };

  return (
    <div className="flex-shrink-0 w-80">
      <Card className="border-2 border-dashed border-gray-300 bg-transparent">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createColumn();
                }
              }}
              placeholder="New column title..."
            />
            <IconButton title="Add column" onClick={createColumn}>
              <PlusCircle size={20} />
            </IconButton>
          </div>
          <p className="text-sm text-gray-500">Add a new column</p>
        </CardContent>
      </Card>
    </div>
  );
};
