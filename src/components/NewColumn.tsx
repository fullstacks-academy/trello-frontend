import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useSetAtom } from "jotai";
import { addColumnAtom } from "../store/atoms";
import { Input } from "../ui/Input";
import { Card, CardContent } from "../ui/Card";
import { IconButton } from "../ui/IconButton";

export const NewColumn = () => {
  const [title, setTitle] = useState("");
  const addColumn = useSetAtom(addColumnAtom);
  const createColumn = () => {
    addColumn(title);
    setTitle("");
  };

  return (
    <div className="flex-shrink-0 w-80">
      <Card className="border-2 border-dashed border-gray-300 bg-transparent">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Input
              type="text"
              placeholder="New column title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createColumn();
                }
              }}
            />
            <IconButton onClick={createColumn} title="Add column">
              <PlusCircle size={20} />
            </IconButton>
          </div>
          <p className="text-sm text-gray-500">Add a new column</p>
        </CardContent>
      </Card>
    </div>
  );
};
