import { screen } from "@testing-library/react";

import type { Task } from "../lib/apiClient";

import { customRender } from "../lib/test";
import { TaskCard } from "./TaskCard";

const task: Task = Object.freeze({
  column_id: "1",
  id: "task-1",
  title: "Sample Task",
  description: "This is a description.",
  created_at: new Date("2023-01-01").toISOString(),
  order_index: 0,
});

describe("taskCard", () => {
  it("should should render title in h4", () => {
    customRender(<TaskCard task={task} />);
    const title = screen.getByText(task.title);

    expect(title).toBeVisible();
  });

  it("should go to edit mode when title is clicked", async () => {
    const { user } = customRender(<TaskCard task={task} />);
    const title = screen.getByText(task.title);
    await user.click(title);
    const input = screen.getByDisplayValue(task.title);

    expect(input).toBeVisible();
  });

  it("should call onUpdate when clicked on submit icon", async () => {
    const spy1 = vi.fn();

    const { user } = customRender(<TaskCard task={task} onUpdate={spy1} />);
    const title = screen.getByText(task.title);
    await user.click(title);
    const input = screen.getByDisplayValue(task.title);
    await user.clear(input);
    await user.type(input, "Updated Task Title");

    const button = screen.getByRole("button", { name: "Confirm changes" });
    await user.click(button);

    expect(spy1).toHaveBeenCalledExactlyOnceWith({
      id: task.id,
      title: "Updated Task Title",
      description: task.description,
    });
  });
});
