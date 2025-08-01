import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-gray-100 hover:text-gray-900",
        destructive: "text-red-400 hover:bg-red-50",
        c2a: "text-green-900 hover:bg-green-50",
      },
      size: {
        default: "h-6 w-6",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
}

export function IconButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: IconButtonProps) {
  const Comp = asChild ? Slot.Slot : "button";
  return (
    <Comp
      className={cn(iconButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
