import type { VariantProps } from "class-variance-authority";

import { cva } from "class-variance-authority";

const variants = cva(
  "flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      error: {
        true: "border-red-500",
      },
    },
  },
);
export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof variants> {}

export function Input({ className, error, ...props }: InputProps) {
  return <input className={variants({ className, error })} {...props} />;
}
