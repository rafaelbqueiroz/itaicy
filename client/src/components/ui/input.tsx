import * as React from "react"
import { cn } from "@/lib/utils"
import { FieldError } from "react-hook-form"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: FieldError;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-river-slate-200 bg-white px-3 py-2 text-sm",
            "placeholder:text-river-slate-500",
            "focus:outline-none focus:ring-2 focus:ring-sunset-amber-600/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500/50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">
            {error.message || "Este campo é obrigatório"}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
