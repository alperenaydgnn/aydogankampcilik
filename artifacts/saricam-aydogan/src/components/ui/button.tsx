import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold",
    "transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary-border rounded-xl shadow-sm " +
          "hover:bg-primary/90 hover:shadow-md hover:-translate-y-px active:translate-y-0 active:shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground border border-secondary-border rounded-xl shadow-sm " +
          "hover:bg-secondary/90 hover:shadow-md hover:-translate-y-px active:translate-y-0",
        outline:
          "border border-border bg-transparent text-foreground rounded-xl shadow-xs " +
          "hover:bg-muted/60 hover:border-border/80 active:shadow-none",
        ghost:
          "border border-transparent text-foreground rounded-xl " +
          "hover:bg-muted/60",
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive-border rounded-xl shadow-sm " +
          "hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline rounded-md",
      },
      size: {
        default: "h-10 px-5 py-2 text-sm",
        sm: "h-8 px-3.5 text-xs rounded-lg",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-9 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
