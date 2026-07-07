"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5 transition-colors duration-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-lg border bg-card px-3 py-2 text-sm transition-colors duration-300",
            "border-input hover:border-foreground focus:border-foreground",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error &&
              "border-destructive focus:ring-destructive/40 focus:border-destructive",
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
