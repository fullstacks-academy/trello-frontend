import { describe, expect, it } from "vitest";

import type { Task } from "../lib/apiClient";

import { groupTasksByColumn } from "./groupTaskByColumn";

describe("groupTasksByColumn", () => {
  it("should group tasks by column", () => {
    const tasks: Task[] = [
      {
        id: "1",
        column_id: "1",
        title: "Task 1",
        description: null,
        order_index: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        column_id: "1",
        title: "Task 2",
        description: null,
        order_index: 0,
        created_at: new Date().toISOString(),
      },
      {
        id: "3",
        column_id: "10",
        title: "Task 3",
        description: null,
        order_index: 0,
        created_at: new Date().toISOString(),
      },
    ];

    const columns = groupTasksByColumn(tasks);

    expect(columns).toEqual({
      "1": [tasks[0], tasks[1]],
      "10": [tasks[2]],
    });
  });
});
