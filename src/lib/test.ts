import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

export const customRender = (...arg: Parameters<typeof render>) => {
  const handle = render(...arg);
  return { ...handle, user: userEvent.setup() };
};
