import * as React from "react"
import { cn } from "@/lib/utils"
import { FieldError } from "react-hook-form"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: FieldError;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-river-slate-200 bg-white px-3 py-2 text-sm",
            "placeholder:text-river-slate-500",
            "focus:outline-none focus:ring-2 focus:ring-sunset-amber-600/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-vertical",
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
Textarea.displayName = "Textarea"

export { Textarea }
