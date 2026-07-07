"use client";

import { cn } from "@/lib/utils";

interface PerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  className?: string;
}

export function PerPageSelect({
  value,
  onChange,
  options = [5, 10, 20, 50],
  className,
}: PerPageSelectProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground",
        className,
      )}
    >
      <span>Show</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "rounded-lg border bg-card px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20",
          "border-border hover:border-primary transition-colors",
        )}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span>per page</span>
    </div>
  );
}
