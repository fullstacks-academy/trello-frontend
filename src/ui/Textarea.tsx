import type { VariantProps } from "class-variance-authority";

import { cva } from "class-variance-authority";

const variants = cva(
  "flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 field-sizing-content",
  {
    variants: {
      size: {
        sm: "text-sm",
        default: "text-lg",
      },
      error: {
        true: "border-red-500 focus-visible:border-gray-300 focus-visible:ring-red-500",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof variants> {}

export function Textarea({ className, size, error, ...props }: TextareaProps) {
  return (
    <textarea className={variants({ className, size, error })} {...props} />
  );
}
