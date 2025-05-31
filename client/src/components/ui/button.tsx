import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps, cva } from "class-variance-authority"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-amber-600/50",
    "disabled:opacity-50 disabled:pointer-events-none"
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-sunset-amber-600 text-cloud-white-0",
          "hover:bg-sunset-amber-700",
          "active:bg-sunset-amber-800",
          "disabled:bg-sunset-amber-400"
        ],
        outline: [
          "border border-river-slate-200 bg-white text-river-slate-900",
          "hover:bg-river-slate-100",
          "active:bg-river-slate-200",
          "disabled:bg-river-slate-50"
        ],
        secondary: [
          "bg-pantanal-green-900 text-cloud-white-0",
          "hover:bg-pantanal-green-800",
          "active:bg-pantanal-green-700",
          "disabled:bg-pantanal-green-600"
        ],
        ghost: [
          "hover:bg-river-slate-100",
          "active:bg-river-slate-200",
          "disabled:bg-transparent"
        ],
        link: [
          "text-sunset-amber-600 underline-offset-4",
          "hover:underline",
          "disabled:text-sunset-amber-400"
        ]
      },
      size: {
        default: "h-10 px-4 py-2 rounded-md",
        sm: "h-9 px-3 rounded",
        lg: "h-12 px-8 rounded-lg text-lg",
        icon: "h-10 w-10 rounded-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, 
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonProps }
