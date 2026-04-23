import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full resize-none rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 text-[14.5px] leading-relaxed text-gray-900 shadow-sm transition-colors placeholder:text-gray-400",
        "focus-visible:border-[#7C3AED]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
