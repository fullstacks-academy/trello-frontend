import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useSetAtom } from "jotai";
import { addColumnAtom } from "../store/atoms";

export const NewColumn = () => {
  const [title, setTitle] = useState("");
  const addColumn = useSetAtom(addColumnAtom);
  const createColumn = () => {
    addColumn(title);
    setTitle("");
  };

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-4">
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            placeholder="New column title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createColumn();
              }
            }}
          />
          <button
            onClick={createColumn}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="Add column"
          >
            <PlusCircle size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-500">Add a new column</p>
      </div>
    </div>
  );
};
