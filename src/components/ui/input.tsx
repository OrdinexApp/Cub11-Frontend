import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-gray-200 bg-white/90 px-4 py-2 text-[14.5px] text-gray-900 shadow-sm placeholder:text-gray-400 transition-colors",
        "focus-visible:border-[#7C3AED]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
